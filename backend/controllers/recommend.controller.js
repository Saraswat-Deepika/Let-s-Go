const OpenAI = require('openai');
const Place = require('../models/Place');
const User = require('../models/User');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

class RecommendController {
  // Generate AI day plan
  async generateDayPlan(req, res) {
    try {
      const {
        city,
        date,
        startTime = '09:00',
        endTime = '18:00',
        budget,
        mood,
        people = 1,
        interests = [],
        dietaryRestrictions = [],
        avoidPlaces = []
      } = req.body;

      // Get available places in city
      const places = await Place.find({
        city: { $regex: city, $options: 'i' },
        isActive: true,
        price: { $lte: budget }
      }).limit(50);

      if (places.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No places found in this city'
        });
      }

      // Filter by mood
      const moodPlaces = this.filterByMood(places, mood);

      // Create prompt for AI
      const prompt = this.createPlanPrompt({
        city,
        date,
        startTime,
        endTime,
        budget,
        mood,
        people,
        interests,
        dietaryRestrictions,
        places: moodPlaces,
        avoidPlaces
      });

      // Call OpenAI API
      let aiResponse;
      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a smart travel planner. Create detailed, practical day plans with specific times, places, and activities. Always respond in valid JSON format.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        });

        aiResponse = JSON.parse(completion.choices[0].message.content);
      } catch (aiError) {
        console.error('AI Error:', aiError);
        // Fallback to algorithmic planning if AI fails
        aiResponse = this.generateFallbackPlan(moodPlaces, {
          startTime,
          endTime,
          budget,
          mood
        });
      }

      // Save plan to user's history if authenticated
      if (req.user) {
        await User.findByIdAndUpdate(req.user.userId, {
          $push: {
            planHistory: {
              plan: aiResponse,
              createdAt: new Date(),
              city,
              mood
            }
          }
        });
      }

      res.json({
        success: true,
        plan: aiResponse,
        alternatives: this.generateAlternatives(moodPlaces, aiResponse, 2)
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get mood-based recommendations
  async getMoodRecommendations(req, res) {
    try {
      const { mood, city, limit = 10 } = req.query;

      const places = await Place.find({
        city: { $regex: city, $options: 'i' },
        isActive: true
      }).limit(100);

      const moodPlaces = this.filterByMood(places, mood);
      const scoredPlaces = this.scorePlaces(moodPlaces, mood);

      // Sort by relevance score
      scoredPlaces.sort((a, b) => b.score - a.score);

      res.json({
        success: true,
        mood,
        places: scoredPlaces.slice(0, limit).map(item => ({
          ...item.place.toObject(),
          relevanceScore: item.score,
          whyRecommended: item.reasons
        }))
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get personalized recommendations
  async getPersonalizedRecommendations(req, res) {
    try {
      const user = await User.findById(req.user.userId)
        .populate('favorites')
        .populate({
          path: 'planHistory.plan.schedule.place',
          model: 'Place'
        });

      const { city, limit = 10 } = req.query;

      // Analyze user preferences
      const userProfile = this.analyzeUserProfile(user);

      // Get candidate places
      const places = await Place.find({
        city: { $regex: city, $options: 'i' },
        isActive: true,
        _id: { $nin: user.favorites.map(f => f._id) }
      }).limit(100);

      // Score based on user profile
      const recommendations = places.map(place => {
        const score = this.calculatePersonalScore(place, userProfile);
        return { place, score };
      });

      recommendations.sort((a, b) => b.score - a.score);

      res.json({
        success: true,
        basedOn: userProfile.topInterests,
        recommendations: recommendations.slice(0, limit).map(item => ({
          ...this.formatPlace(item.place),
          matchScore: Math.round(item.score * 100) + '%',
          reasons: this.getRecommendationReasons(item.place, userProfile)
        }))
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get similar places
  async getSimilarPlaces(req, res) {
    try {
      const { placeId } = req.params;
      const { limit = 6 } = req.query;

      const targetPlace = await Place.findById(placeId);
      if (!targetPlace) {
        return res.status(404).json({
          success: false,
          message: 'Place not found'
        });
      }

      // Find similar places
      const similar = await Place.find({
        _id: { $ne: placeId },
        category: targetPlace.category,
        city: targetPlace.city,
        isActive: true
      }).limit(limit * 2);

      // Score similarity
      const scored = similar.map(place => ({
        place,
        similarity: this.calculateSimilarity(targetPlace, place)
      }));

      scored.sort((a, b) => b.similarity - a.similarity);

      res.json({
        success: true,
        basedOn: {
          name: targetPlace.name,
          category: targetPlace.category,
          tags: targetPlace.tags
        },
        similarPlaces: scored.slice(0, limit).map(item => ({
          ...this.formatPlace(item.place),
          similarity: Math.round(item.similarity * 100) + '%'
        }))
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Helper methods
  filterByMood(places, mood) {
    const moodMappings = {
      fun: ['Gaming', 'Amusement Park', 'Bowling', 'Arcade', 'Cinema', 'Adventure'],
      relax: ['Park', 'Spa', 'Library', 'Garden', 'Lake', 'Beach'],
      romantic: ['Rooftop', 'Garden', 'Lake', 'Cafe', 'Restaurant', 'Viewpoint'],
      adventure: ['Trekking', 'Camping', 'Water Sports', 'Rock Climbing', 'Hiking'],
      spiritual: ['Temple', 'Mosque', 'Church', 'Gurudwara', 'Meditation', 'Ashram'],
      foodie: ['Restaurant', 'Street Food', 'Cafe', 'Bakery', 'Food Court']
    };

    const preferredCategories = moodMappings[mood] || [];
    
    return places.filter(place => {
      const matchesCategory = preferredCategories.some(cat => 
        place.category.toLowerCase().includes(cat.toLowerCase()) ||
        place.subcategory?.toLowerCase().includes(cat.toLowerCase())
      );
      
      const matchesTags = place.tags?.some(tag => 
        preferredCategories.some(cat => 
          tag.toLowerCase().includes(cat.toLowerCase())
        )
      );

      return matchesCategory || matchesTags;
    });
  }

  createPlanPrompt(data) {
    const { city, date, startTime, endTime, budget, mood, people, interests, dietaryRestrictions, places, avoidPlaces } = data;

    return `
Create a detailed day plan for ${city} on ${date || 'upcoming day'}.

CONSTRAINTS:
- Time: ${startTime} to ${endTime}
- Budget: ₹${budget} total for ${people} person(s)
- Mood/Vibe: ${mood}
- Interests: ${interests.join(', ') || 'general'}
${dietaryRestrictions.length ? `- Dietary restrictions: ${dietaryRestrictions.join(', ')}` : ''}
${avoidPlaces.length ? `- Avoid: ${avoidPlaces.join(', ')}` : ''}

AVAILABLE PLACES:
${places.map(p => `- ${p.name} (${p.category}): ₹${p.price}, Rating: ${p.rating}/5, ${p.description?.substring(0, 100)}`).join('\n')}

Create a JSON response with this structure:
{
  "title": "Catchy title for the day",
  "schedule": [
    {
      "time": "HH:MM AM/PM",
      "place": "Exact place name from list",
      "activity": "What to do there",
      "duration": "X hours",
      "cost": estimated cost in number,
      "tips": ["tip1", "tip2"]
    }
  ],
  "totalCost": total estimated cost,
  "breakdown": {
    "food": cost,
    "activities": cost,
    "transport": cost
  },
  "tips": ["general tip 1", "general tip 2"],
  "alternatives": [
    {
      "time": "HH:MM AM/PM",
      "option": "Alternative place name",
      "reason": "Why this alternative"
    }
  ]
}

Ensure:
1. Realistic timing with travel time between places
2. Stay within budget
3. Match the mood/theme
4. Include meal times appropriate to the schedule
5. Order by time sequentially
`;
  }

  generateFallbackPlan(places, constraints) {
    const { startTime, endTime, budget, mood } = constraints;
    
    // Simple algorithmic planning
    const plan = {
      title: `${mood.charAt(0).toUpperCase() + mood.slice(1)} Day in the City`,
      schedule: [],
      totalCost: 0,
      tips: ['Start early to avoid crowds', 'Carry cash for street vendors']
    };

    // Sort places by rating and price
    const sorted = places.sort((a, b) => b.rating - a.rating);
    
    let currentTime = this.parseTime(startTime);
    const end = this.parseTime(endTime);
    let totalCost = 0;

    // Add 3-4 places
    for (let i = 0; i < Math.min(4, sorted.length) && currentTime < end; i++) {
      const place = sorted[i];
      if (totalCost + place.price > budget) continue;

      const duration = 90; // 1.5 hours default
      plan.schedule.push({
        time: this.formatTime(currentTime),
        place: place.name,
        activity: `Visit and explore ${place.name}`,
        duration: `${Math.floor(duration / 60)}h ${duration % 60}m`,
        cost: place.price,
        tips: ['Best time to visit', 'Check for offers']
      });

      totalCost += place.price;
      currentTime += duration + 30; // Add travel time
    }

    plan.totalCost = totalCost;
    plan.breakdown = {
      food: Math.floor(totalCost * 0.4),
      activities: Math.floor(totalCost * 0.5),
      transport: Math.floor(totalCost * 0.1)
    };

    return plan;
  }

  generateAlternatives(places, currentPlan, count) {
    const usedPlaces = new Set(currentPlan.schedule.map(s => s.place));
    return places
      .filter(p => !usedPlaces.has(p.name))
      .slice(0, count)
      .map(p => ({
        place: p.name,
        category: p.category,
        why: `Highly rated ${p.category.toLowerCase()} with ${p.rating}⭐`
      }));
  }

  scorePlaces(places, mood) {
    const moodWeights = {
      fun: { gaming: 1, entertainment: 1, adventure: 0.8 },
      relax: { nature: 1, spa: 1, quiet: 0.9 },
      romantic: { scenic: 1, dining: 0.9, private: 0.8 },
      adventure: { outdoor: 1, sports: 1, thrill: 0.9 },
      spiritual: { religious: 1, peaceful: 0.9, cultural: 0.8 },
      foodie: { food: 1, dining: 1, local: 0.9 }
    };

    const weights = moodWeights[mood] || {};

    return places.map(place => {
      let score = place.rating * 0.3; // Base score from rating
      const reasons = [`Highly rated (${place.rating}⭐)`];

      // Category matching
      const category = place.category.toLowerCase();
      Object.entries(weights).forEach(([key, weight]) => {
        if (category.includes(key)) {
          score += weight * 0.4;
          reasons.push(`Great for ${mood} - ${key}`);
        }
      });

      // Price factor (prefer mid-range for better value)
      const priceScore = place.price === 0 ? 0.2 : Math.max(0, 1 - Math.abs(place.price - 500) / 1000);
      score += priceScore * 0.2;

      // Popularity bonus
      if (place.views > 1000) {
        score += 0.1;
        reasons.push('Popular destination');
      }

      return { place, score: Math.min(score, 1), reasons };
    });
  }

  analyzeUserProfile(user) {
    const interests = {};
    const categories = {};

    // Analyze favorites
    user.favorites.forEach(place => {
      categories[place.category] = (categories[place.category] || 0) + 1;
      place.tags?.forEach(tag => {
        interests[tag] = (interests[tag] || 0) + 1;
      });
    });

    // Analyze plan history
    user.planHistory.forEach(history => {
      history.plan.schedule.forEach(item => {
        if (item.place?.category) {
          categories[item.place.category] = (categories[item.place.category] || 0) + 0.5;
        }
      });
    });

    const topInterests = Object.entries(interests)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name]) => name);

    return { interests, categories, topInterests };
  }

  calculatePersonalScore(place, profile) {
    let score = 0;

    // Category match
    if (profile.categories[place.category]) {
      score += profile.categories[place.category] * 0.3;
    }

    // Tag match
    place.tags?.forEach(tag => {
      if (profile.interests[tag]) {
        score += profile.interests[tag] * 0.2;
      }
    });

    // Rating bonus
    score += (place.rating / 5) * 0.2;

    // Price preference (assume mid-range preference)
    const priceScore = place.price < 1000 ? 0.2 : 0.1;
    score += priceScore;

    return Math.min(score, 1);
  }

  getRecommendationReasons(place, profile) {
    const reasons = [];
    
    if (profile.categories[place.category]) {
      reasons.push(`You like ${place.category}s`);
    }
    
    const matchingTags = place.tags?.filter(tag => profile.interests[tag]) || [];
    if (matchingTags.length > 0) {
      reasons.push(`Matches your interest in ${matchingTags[0]}`);
    }
    
    reasons.push(`${place.rating}⭐ rated`);
    
    return reasons;
  }

  calculateSimilarity(place1, place2) {
    let similarity = 0;

    // Same category
    if (place1.category === place2.category) similarity += 0.4;

    // Same subcategory
    if (place1.subcategory === place2.subcategory) similarity += 0.2;

    // Tag overlap
    const tags1 = place1.tags || [];
    const tags2 = place2.tags || [];
    const commonTags = tags1.filter(t => tags2.includes(t));
    similarity += (commonTags.length / Math.max(tags1.length, tags2.length)) * 0.3;

    // Price similarity
    const priceDiff = Math.abs(place1.price - place2.price);
    similarity += Math.max(0, 1 - priceDiff / 1000) * 0.1;

    return similarity;
  }

  parseTime(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  formatTime(minutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 || 12;
    return `${displayH}:${m.toString().padStart(2, '0')} ${ampm}`;
  }

  formatPlace(place) {
    return {
      id: place._id,
      name: place.name,
      category: place.category,
      rating: place.rating,
      price: place.price,
      location: place.location,
      images: place.images
    };
  }
}

module.exports = new RecommendController();