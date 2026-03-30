const Place = require('../models/Place');
const User = require('../models/User');

// Standalone formatting function to prevent 'this' context errors
const formatPlace = (place, detailed = false) => {
  if (!place) return null;
  const formatted = {
    id: place._id,
    name: place.name,
    description: place.description,
    category: place.category,
    subcategory: place.subcategory,
    location: place.location,
    address: place.address,
    city: place.city,
    timings: place.timings,
    entry_fee: place.entry_fee,
    best_time: place.best_time,
    coordinates: place.coordinates || { lat: place.lat, lng: place.lng },
    lat: place.lat,
    lng: place.lng,
    rating: place.rating,
    price: place.price,
    priceRange: place.priceRange,
    images: place.images,
    amenities: place.amenities,
    openingHours: place.openingHours,
    contact: place.contact,
    tags: place.tags,
    crowdLevel: place.crowdLevel,
    safetyRating: place.safetyRating,
    isActive: place.isActive,
    views: place.views,
    createdAt: place.createdAt
  };

  if (detailed && place.reviews) {
    formatted.reviews = place.reviews.map(review => ({
      id: review._id,
      user: review.user,
      rating: review.rating,
      comment: review.comment,
      visitDate: review.visitDate,
      createdAt: review.createdAt
    }));
  }

  return formatted;
};

class PlacesController {
  // Get all places with filters
  getAllPlaces = async (req, res) => {
    try {
      const {
        city,
        category,
        minRating,
        maxPrice,
        sortBy = 'rating',
        order = 'desc',
        page = 1,
        limit = 20,
        lat,
        lng,
        radius = 5000 // meters
      } = req.query;

      // Build filter object
      const filter = {};

      if (city) {
        filter.city = { $regex: city, $options: 'i' };
      }

      if (category && category !== 'all') {
        filter.category = { $regex: category, $options: 'i' };
      }

      if (minRating) {
        filter.rating = { $gte: parseFloat(minRating) };
      }

      if (maxPrice) {
        filter.price = { $lte: parseFloat(maxPrice) };
      }

      // Geospatial query if coordinates provided
      if (lat && lng) {
        filter.location = {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(lng), parseFloat(lat)]
            },
            $maxDistance: parseInt(radius)
          }
        };
      }

      // Build sort object
      const sortOptions = {};
      sortOptions[sortBy] = order === 'asc' ? 1 : -1;

      // Execute query with pagination
      const [places, count] = await Promise.all([
        Place.find(filter)
          .sort(sortOptions)
          .limit(limit * 1)
          .skip((page - 1) * limit)
          .populate('reviews.user', 'name avatar'),
        Place.countDocuments(filter)
      ]);

      res.json({
        success: true,
        places: places.map(place => formatPlace(place)),
        pagination: {
          total: count,
          pages: Math.ceil(count / limit),
          currentPage: parseInt(page),
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get single place by ID
  getPlaceById = async (req, res) => {
    try {
      const place = await Place.findById(req.params.id)
        .populate('reviews.user', 'name avatar');

      if (!place) {
        return res.status(404).json({
          success: false,
          message: 'Place not found'
        });
      }

      // Increment view count
      place.views = (place.views || 0) + 1;
      await place.save();

      res.json({
        success: true,
        place: formatPlace(place, true)
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Create new place
  createPlace = async (req, res) => {
    try {
      const placeData = {
        ...req.body,
        createdBy: req.user.userId
      };

      // Handle image upload
      if (req.file) {
        placeData.images = [`/uploads/${req.file.filename}`];
      }

      const place = new Place(placeData);
      await place.save();

      res.status(201).json({
        success: true,
        message: 'Place created successfully',
        place: formatPlace(place)
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Update place
  updatePlace = async (req, res) => {
    try {
      const place = await Place.findById(req.params.id);

      if (!place) {
        return res.status(404).json({
          success: false,
          message: 'Place not found'
        });
      }

      // Check if user is creator or admin
      if (place.createdBy.toString() !== req.user.userId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this place'
        });
      }

      const updates = { ...req.body, updatedAt: Date.now() };

      if (req.file) {
        updates.images = [...(place.images || []), `/uploads/${req.file.filename}`];
      }

      const updatedPlace = await Place.findByIdAndUpdate(
        req.params.id,
        { $set: updates },
        { new: true }
      );

      res.json({
        success: true,
        message: 'Place updated successfully',
        place: formatPlace(updatedPlace)
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Delete place
  deletePlace = async (req, res) => {
    try {
      const place = await Place.findById(req.params.id);

      if (!place) {
        return res.status(404).json({
          success: false,
          message: 'Place not found'
        });
      }

      if (place.createdBy.toString() !== req.user.userId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this place'
        });
      }

      await place.deleteOne();

      res.json({
        success: true,
        message: 'Place deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get featured places
  getFeaturedPlaces = async (req, res) => {
    try {
      const { city, limit = 6 } = req.query;

      const filter = { isActive: true };
      if (city) {
        filter.city = { $regex: city, $options: 'i' };
      }

      const places = await Place.find(filter)
        .sort({ rating: -1, views: -1 })
        .limit(parseInt(limit));

      res.json({
        success: true,
        places: places.map(place => formatPlace(place))
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get places by category
  getPlacesByCategory = async (req, res) => {
    try {
      const { category } = req.params;
      const { city, page = 1, limit = 20 } = req.query;

      const filter = {
        category: { $regex: category, $options: 'i' },
        isActive: true
      };

      if (city) {
        filter.city = { $regex: city, $options: 'i' };
      }

      const places = await Place.find(filter)
        .sort({ rating: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      res.json({
        success: true,
        category,
        places: places.map(place => formatPlace(place))
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Toggle favorite
  toggleFavorite = async (req, res) => {
    try {
      const user = await User.findById(req.user.userId);
      const placeId = req.params.id;

      const index = user.favorites.indexOf(placeId);
      let message;

      if (index === -1) {
        user.favorites.push(placeId);
        message = 'Added to favorites';
      } else {
        user.favorites.splice(index, 1);
        message = 'Removed from favorites';
      }

      await user.save();

      res.json({
        success: true,
        message,
        favorites: user.favorites
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get user's favorites
  getFavorites = async (req, res) => {
    try {
      const user = await User.findById(req.user.userId)
        .populate('favorites');

      res.json({
        success: true,
        favorites: user.favorites.map(place => formatPlace(place))
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Add review
  addReview = async (req, res) => {
    try {
      const { rating, comment, visitDate } = req.body;
      const place = await Place.findById(req.params.id);

      if (!place) {
        return res.status(404).json({
          success: false,
          message: 'Place not found'
        });
      }

      // Check if user already reviewed
      const existingReview = place.reviews.find(
        r => r.user.toString() === req.user.userId
      );

      if (existingReview) {
        return res.status(400).json({
          success: false,
          message: 'You have already reviewed this place'
        });
      }

      const review = {
        user: req.user.userId,
        rating: parseInt(rating),
        comment,
        visitDate: visitDate || new Date()
      };

      place.reviews.push(review);
      
      // Recalculate average rating
      const totalRating = place.reviews.reduce((sum, r) => sum + r.rating, 0);
      place.rating = totalRating / place.reviews.length;

      await place.save();

      res.json({
        success: true,
        message: 'Review added successfully',
        place: formatPlace(place, true)
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new PlacesController();