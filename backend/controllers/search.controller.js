const Place = require('../models/Place');

class SearchController {
  // Main search endpoint
  search = async (req, res) => {
    try {
      const {
        q, // query string
        city,
        category,
        minPrice,
        maxPrice,
        minRating,
        openNow,
        amenities,
        tags,
        lat,
        lng,
        sortBy = 'relevance',
        page = 1,
        limit = 20
      } = req.query;

      // Build search query
      const query = { isActive: true };

      // Text search with fuzzy/partial support
      if (q) {
        const keywords = q.trim().split(/\s+/).filter(word => word.length > 1);
        
        // Exact regex match
        const exactMatch = [
          { name: { $regex: q, $options: 'i' } },
          { category: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } },
          { tags: { $in: [new RegExp(q, 'i')] } }
        ];

        // Keyword matches (for spelling mistakes/partial words)
        const keywordMatches = keywords.flatMap(word => [
          { name: { $regex: word, $options: 'i' } },
          { tags: { $in: [new RegExp(word, 'i')] } },
          { category: { $regex: word, $options: 'i' } }
        ]);

        query.$or = [...exactMatch, ...keywordMatches];
      }

      // Filters
      if (city) query.city = { $regex: city, $options: 'i' };
      if (category) query.category = { $regex: category, $options: 'i' };
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = parseInt(minPrice);
        if (maxPrice) query.price.$lte = parseInt(maxPrice);
      }
      if (minRating) query.rating = { $gte: parseFloat(minRating) };
      if (amenities) {
        const amenitiesList = amenities.split(',');
        query.amenities = { $in: amenitiesList };
      }
      if (tags) {
        const tagList = tags.split(',');
        query.tags = { $in: tagList.map(t => new RegExp(t, 'i')) };
      }

      // Open now filter
      if (openNow === 'true') {
        const now = new Date();
        const currentDay = now.toLocaleDateString('en-US', { weekday: 'lowercase' });
        
        // This is a simplified check - in production, use more robust logic
        query[`openingHours.${currentDay}.isOpen`] = true;
      }

      // Build sort options
      let sortOptions = {};
      switch (sortBy) {
        case 'rating':
          sortOptions = { rating: -1 };
          break;
        case 'price_low':
          sortOptions = { price: 1 };
          break;
        case 'price_high':
          sortOptions = { price: -1 };
          break;
        case 'popularity':
          sortOptions = { views: -1 };
          break;
        case 'distance':
          // Requires geospatial query
          sortOptions = { location: 1 };
          break;
        default:
          // Relevance scoring (simplified)
          sortOptions = { rating: -1, views: -1 };
      }

      // Execute search
      const [places, total] = await Promise.all([
        Place.find(query)
          .sort(sortOptions)
          .limit(limit * 1)
          .skip((page - 1) * limit)
          .select('-reviews'), // Exclude reviews for list view
        Place.countDocuments(query)
      ]);

      // Calculate relevance scores if searching
      let results = q ? this.calculateRelevance(places, q) : places;

      // Add distance if coordinates provided
      if (lat && lng && lat !== 'null' && lng !== 'null') {
        const uLat = parseFloat(lat);
        const uLng = parseFloat(lng);
        
        results = results.map(p => {
          const placeObj = p.toObject ? p.toObject() : p;
          const pLat = p.lat || p.coordinates?.lat;
          const pLng = p.lng || p.coordinates?.lng;
          
          return {
            ...placeObj,
            distance: (pLat && pLng) ? this.calculateDistance(
              uLat,
              uLng,
              pLat,
              pLng
            ) : null
          };
        });

        // If distance is the primary sort, re-sort
        if (sortBy === 'distance') {
          results.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
        }
      }

      res.json({
        success: true,
        query: q || '',
        filters: {
          city: city || null,
          category: category || null,
          priceRange: { min: minPrice || 0, max: maxPrice || 'unlimited' }
        },
        results: results.map(p => this.formatSearchResult(p, !!(lat && lng))),
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
          limit: parseInt(limit)
        },
        suggestions: q ? await this.getSuggestions(q, city) : []
      });
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Autocomplete suggestions
  autocomplete = async (req, res) => {
    try {
      const { q, city, limit = 10 } = req.query;

      if (!q || q.length < 2) {
        return res.json({
          success: true,
          suggestions: []
        });
      }

      const query = {
        isActive: true,
        $or: [
          { name: { $regex: `^${q}`, $options: 'i' } },
          { name: { $regex: q, $options: 'i' } }
        ]
      };

      if (city) query.city = city;

      const places = await Place.find(query)
        .limit(parseInt(limit))
        .select('name category city');

      // Get unique suggestions
      const suggestions = [
        ...places.map(p => ({
          type: 'place',
          value: p.name,
          category: p.category,
          city: p.city
        })),
        // Add category suggestions
        ...this.getCategorySuggestions(q),
        // Add city suggestions if not filtered
        ...(!city ? await this.getCitySuggestions(q) : [])
      ];

      res.json({
        success: true,
        query: q,
        suggestions: suggestions.slice(0, limit)
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get popular searches
  getPopularSearches = async (req, res) => {
    try {
      const { city, limit = 10 } = req.query;

      // In production, this would come from analytics/aggregation
      // For now, return popular categories and places
      const popular = await Place.aggregate([
        { $match: city ? { city } : {} },
        { $group: {
          _id: '$category',
          count: { $sum: 1 },
          places: { $push: '$name' }
        }},
        { $sort: { count: -1 } },
        { $limit: parseInt(limit) }
      ]);

      res.json({
        success: true,
        popular: popular.map(p => ({
          category: p._id,
          searchCount: p.count,
          topPlaces: p.places.slice(0, 3)
        }))
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get trending places
  getTrending = async (req, res) => {
    try {
      const { city, limit = 10, timeframe = '7d' } = req.query;

      // Calculate date range
      const days = parseInt(timeframe);
      const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      const query = {
        isActive: true,
        createdAt: { $gte: cutoffDate }
      };

      if (city) query.city = city;

      const trending = await Place.find(query)
        .sort({ views: -1, rating: -1 })
        .limit(parseInt(limit));

      res.json({
        success: true,
        timeframe,
        trending: trending.map(p => ({
          id: p._id,
          name: p.name,
          category: p.category,
          rating: p.rating,
          views: p.views,
          growth: this.calculateGrowth(p)
        }))
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Nearby search
  nearby = async (req, res) => {
    try {
      const { lat, lng, radius = 5000, category, limit = 20 } = req.query;

      if (!lat || !lng) {
        return res.status(400).json({
          success: false,
          message: 'Latitude and longitude required'
        });
      }

      const query = {
        isActive: true,
        coordinates: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(lng), parseFloat(lat)]
            },
            $maxDistance: parseInt(radius)
          }
        }
      };

      if (category) query.category = category;

      const places = await Place.find(query).limit(parseInt(limit));

      // Calculate actual distances
      const results = places.map(place => ({
        ...this.formatSearchResult(place),
        distance: this.calculateDistance(
          parseFloat(lat),
          parseFloat(lng),
          place.coordinates?.lat || place.lat,
          place.coordinates?.lng || place.lng
        )
      }));

      // Sort by distance
      results.sort((a, b) => a.distance - b.distance);

      res.json({
        success: true,
        center: { lat: parseFloat(lat), lng: parseFloat(lng) },
        radius: parseInt(radius),
        results
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get suggestions for main search
  getSuggestions = async (query, city) => {
    try {
      if (!query || query.length < 2) return [];

      const searchCriteria = {
        isActive: true,
        $or: [
          { name: { $regex: `^${query}`, $options: 'i' } },
          { category: { $regex: `^${query}`, $options: 'i' } }
        ]
      };

      if (city) searchCriteria.city = city;

      const places = await Place.find(searchCriteria)
        .limit(5)
        .select('name category city');

      return places.map(p => ({
        text: p.name,
        type: 'place',
        category: p.category,
        city: p.city
      }));
    } catch (err) {
      console.error('Error getting suggestions:', err);
      return [];
    }
  }

  // Helper methods
  calculateRelevance = (places, query) => {
    const queryLower = query.toLowerCase();
    
    return places.map(place => {
      let score = 0;
      const nameLower = place.name.toLowerCase();
      
      // Exact match
      if (nameLower === queryLower) score += 10;
      // Starts with
      else if (nameLower.startsWith(queryLower)) score += 5;
      // Contains
      else if (nameLower.includes(queryLower)) score += 3;
      
      // Description match
      if (place.description?.toLowerCase().includes(queryLower)) score += 2;
      
      // Tag match
      const tagMatches = place.tags?.filter(t => 
        t.toLowerCase().includes(queryLower)
      ).length || 0;
      score += tagMatches;
      
      // Boost by rating and popularity
      score += place.rating;
      score += Math.log10((place.views || 0) + 1);
      
      return { ...place.toObject(), relevanceScore: score };
    }).sort((a, b) => b.relevanceScore - a.relevanceScore);
  }


  getCategorySuggestions = (query) => {
    const categories = [
      'Temple', 'Cafe', 'Restaurant', 'Park', 'Museum',
      'Shopping Mall', 'Gaming Zone', 'Movie Theater',
      'Beach', 'Lake', 'Mountain', 'Historical Site'
    ];
    
    return categories
      .filter(c => c.toLowerCase().includes(query.toLowerCase()))
      .map(c => ({ type: 'category', value: c }));
  }

  getCitySuggestions = async (query) => {
    const cities = await Place.distinct('city', {
      city: { $regex: query, $options: 'i' }
    });
    
    return cities.slice(0, 5).map(c => ({ 
      type: 'city', 
      value: c 
    }));
  }

  calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c * 1000); // Return in meters
  }

  toRad = (value) => {
    return value * Math.PI / 180;
  }

  calculateGrowth = (place) => {
    // Simplified growth calculation
    const ageInDays = (Date.now() - place.createdAt) / (1000 * 60 * 60 * 24);
    return Math.round((place.views / Math.max(ageInDays, 1)) * 10) / 10;
  }

  formatSearchResult = (place, hasDistance = false) => {
    const p = place.toObject ? place.toObject() : place;
    return {
      id: p._id,
      name: p.name,
      category: p.category,
      subcategory: p.subcategory,
      description: p.description?.substring(0, 150) + '...',
      location: p.location,
      area: p.area,
      city: p.city,
      timings: p.timings,
      entry_fee: p.entry_fee,
      best_time: p.best_time,
      rating: p.rating,
      reviewCount: p.reviewCount || p.reviews?.length || 0,
      price: p.price,
      priceRange: p.priceRange,
      images: p.images?.slice(0, 3),
      amenities: p.amenities?.slice(0, 5),
      tags: p.tags,
      coordinates: p.coordinates || { lat: p.lat, lng: p.lng },
      crowdLevel: p.crowdLevel,
      safetyRating: p.safetyRating,
      isOpen: this.checkIfOpen(p.openingHours || p.timings),
      distance: p.distance // if available
    };
  }

  checkIfOpen = (hours) => {
    if (!hours || typeof hours !== 'object') return null;
    const now = new Date();
    const day = now.toLocaleDateString('en-US', { weekday: 'lowercase' });
    const currentHours = hours[day];
    
    if (!currentHours || !currentHours.isOpen || !currentHours.open || !currentHours.close) return false;
    
    try {
      const currentTime = now.getHours() * 60 + now.getMinutes();
      const [openH, openM] = currentHours.open.split(':').map(Number);
      const [closeH, closeM] = currentHours.close.split(':').map(Number);
      
      const openMinutes = openH * 60 + openM;
      const closeMinutes = closeH * 60 + closeM;
      
      return currentTime >= openMinutes && currentTime <= closeMinutes;
    } catch (err) {
      return null;
    }
  }
}

module.exports = new SearchController();