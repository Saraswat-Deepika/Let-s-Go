const Place = require('../models/Place');
const Rating = require('../models/Rating');

class RatingsController {
  // Submit crowd report
  async submitCrowdReport(req, res) {
    try {
      const { placeId, crowdLevel, waitTime, description } = req.body;

      const rating = new Rating({
        type: 'crowd',
        place: placeId,
        user: req.user.userId,
        crowdLevel, // low, medium, high
        waitTime,
        description,
        timestamp: new Date()
      });

      await rating.save();

      // Update place's current crowd level (weighted average of recent reports)
      await this.updatePlaceCrowdLevel(placeId);

      res.json({
        success: true,
        message: 'Crowd report submitted successfully',
        rating
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Submit safety report
  async submitSafetyReport(req, res) {
    try {
      const { placeId, safetyRating, safetyFactors, description, incidentReport } = req.body;

      // Validate safety rating (1-5)
      if (safetyRating < 1 || safetyRating > 5) {
        return res.status(400).json({
          success: false,
          message: 'Safety rating must be between 1 and 5'
        });
      }

      const rating = new Rating({
        type: 'safety',
        place: placeId,
        user: req.user.userId,
        safetyRating,
        safetyFactors: safetyFactors || [], // well-lit, crowded, police-nearby, etc.
        description,
        incidentReport: incidentReport || false,
        timestamp: new Date()
      });

      await rating.save();

      // Update place's safety rating
      await this.updatePlaceSafetyRating(placeId);

      res.json({
        success: true,
        message: 'Safety report submitted successfully',
        rating
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get live crowd status
  async getLiveCrowdStatus(req, res) {
    try {
      const { placeId, city, lat, lng, radius = 5000 } = req.query;

      let query = { type: 'crowd' };
      
      // Get reports from last 2 hours
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
      query.timestamp = { $gte: twoHoursAgo };

      if (placeId) {
        query.place = placeId;
      }

      let placeQuery = {};
      if (city) placeQuery.city = city;

      // Get places with recent crowd reports
      const places = await Place.find(placeQuery)
        .select('name location crowdLevel crowdLastUpdated safetyRating');

      // Get recent reports for each place
      const placesWithCrowd = await Promise.all(
        places.map(async (place) => {
          const recentReport = await Rating.findOne({
            place: place._id,
            type: 'crowd',
            timestamp: { $gte: twoHoursAgo }
          }).sort({ timestamp: -1 });

          return {
            id: place._id,
            name: place.name,
            location: place.location,
            crowdLevel: recentReport ? recentReport.crowdLevel : place.crowdLevel || 'unknown',
            waitTime: recentReport?.waitTime || 'N/A',
            lastUpdated: recentReport?.timestamp || place.crowdLastUpdated,
            safetyRating: place.safetyRating
          };
        })
      );

      res.json({
        success: true,
        places: placesWithCrowd.filter(p => p.crowdLevel !== 'unknown'),
        lastUpdated: new Date()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get safety map data
  async getSafetyMap(req, res) {
    try {
      const { city, lat, lng, radius = 10000 } = req.query;

      let query = { isActive: true };
      
      if (city) {
        query.city = city;
      }

      // Get places with safety ratings
      const places = await Place.find(query)
        .select('name location coordinates safetyRating safetyFactors');

      // Categorize by safety level
      const safetyData = {
        verySafe: [],
        safe: [],
        moderate: [],
        caution: [],
        avoid: []
      };

      places.forEach(place => {
        const rating = place.safetyRating || 3;
        const data = {
          id: place._id,
          name: place.name,
          coordinates: place.coordinates,
          rating: rating,
          factors: place.safetyFactors || []
        };

        if (rating >= 4.5) safetyData.verySafe.push(data);
        else if (rating >= 3.5) safetyData.safe.push(data);
        else if (rating >= 2.5) safetyData.moderate.push(data);
        else if (rating >= 1.5) safetyData.caution.push(data);
        else safetyData.avoid.push(data);
      });

      res.json({
        success: true,
        safetyData,
        totalPlaces: places.length,
        lastUpdated: new Date()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get place ratings history
  async getPlaceRatings(req, res) {
    try {
      const { placeId } = req.params;
      const { type, limit = 20 } = req.query;

      let query = { place: placeId };
      if (type) query.type = type;

      const ratings = await Rating.find(query)
        .populate('user', 'name avatar')
        .sort({ timestamp: -1 })
        .limit(parseInt(limit));

      // Calculate statistics
      const stats = await Rating.aggregate([
        { $match: { place: require('mongoose').Types.ObjectId(placeId), type: 'safety' } },
        {
          $group: {
            _id: null,
            avgRating: { $avg: '$safetyRating' },
            totalReports: { $sum: 1 },
            incidentCount: {
              $sum: { $cond: ['$incidentReport', 1, 0] }
            }
          }
        }
      ]);

      res.json({
        success: true,
        ratings: ratings.map(r => ({
          id: r._id,
          type: r.type,
          user: r.user,
          crowdLevel: r.crowdLevel,
          waitTime: r.waitTime,
          safetyRating: r.safetyRating,
          description: r.description,
          timestamp: r.timestamp
        })),
        statistics: stats[0] || { avgRating: 0, totalReports: 0, incidentCount: 0 }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Helper: Update place crowd level
  async updatePlaceCrowdLevel(placeId) {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    
    const reports = await Rating.find({
      place: placeId,
      type: 'crowd',
      timestamp: { $gte: twoHoursAgo }
    }).sort({ timestamp: -1 }).limit(10);

    if (reports.length === 0) return;

    // Weight recent reports more heavily
    const weights = { low: 1, medium: 2, high: 3 };
    let totalWeight = 0;
    let weightedSum = 0;

    reports.forEach((report, index) => {
      const weight = Math.exp(-index * 0.3); // Exponential decay
      weightedSum += weights[report.crowdLevel] * weight;
      totalWeight += weight;
    });

    const avgWeight = weightedSum / totalWeight;
    let crowdLevel = 'medium';
    if (avgWeight < 1.5) crowdLevel = 'low';
    else if (avgWeight > 2.5) crowdLevel = 'high';

    await Place.findByIdAndUpdate(placeId, {
      crowdLevel,
      crowdLastUpdated: new Date()
    });
  }

  // Helper: Update place safety rating
  async updatePlaceSafetyRating(placeId) {
    const ratings = await Rating.find({
      place: placeId,
      type: 'safety'
    });

    if (ratings.length === 0) return;

    const avgRating = ratings.reduce((sum, r) => sum + r.safetyRating, 0) / ratings.length;
    
    // Get common safety factors
    const factorCounts = {};
    ratings.forEach(r => {
      r.safetyFactors.forEach(f => {
        factorCounts[f] = (factorCounts[f] || 0) + 1;
      });
    });

    const topFactors = Object.entries(factorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([factor]) => factor);

    await Place.findByIdAndUpdate(placeId, {
      safetyRating: parseFloat(avgRating.toFixed(1)),
      safetyFactors: topFactors,
      safetyLastUpdated: new Date()
    });
  }
}

module.exports = new RatingsController();