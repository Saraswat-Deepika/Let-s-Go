const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    maxlength: 1000
  },
  visitDate: {
    type: Date
  },
  images: [String],
  helpful: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const placeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Place name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    required: true,
    enum: ['Temple', 'Cafe', 'Restaurant', 'Park', 'Museum', 'Gaming', 
           'Shopping', 'Entertainment', 'Nature', 'Historical', 'Beach', 
           'Lake', 'Adventure', 'Spiritual', 'Street Food', 'Other']
  },
  subcategory: {
    type: String,
    trim: true
  },
  
  // Location
  location: {
    type: String,
    required: true
  },
  address: {
    street: String,
    area: String,
    city: {
      type: String,
      required: true
    },
    state: String,
    pincode: String,
    country: {
      type: String,
      default: 'India'
    }
  },
  coordinates: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  
  // Pricing
  price: {
    type: Number,
    default: 0,
    min: 0
  },
  priceRange: {
    type: String,
    enum: ['free', 'low', 'medium', 'high', 'luxury']
  },
  
  // Media
  images: [{
    type: String
  }],
  videos: [String],
  
  // Details
  amenities: [String],
  tags: [String],
  openingHours: {
    monday: { isOpen: Boolean, open: String, close: String },
    tuesday: { isOpen: Boolean, open: String, close: String },
    wednesday: { isOpen: Boolean, open: String, close: String },
    thursday: { isOpen: Boolean, open: String, close: String },
    friday: { isOpen: Boolean, open: String, close: String },
    saturday: { isOpen: Boolean, open: String, close: String },
    sunday: { isOpen: Boolean, open: String, close: String }
  },
  contact: {
    phone: String,
    email: String,
    website: String,
    socialMedia: {
      facebook: String,
      instagram: String,
      twitter: String
    }
  },
  
  // Ratings & Reviews
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [reviewSchema],
  reviewCount: {
    type: Number,
    default: 0
  },
  
  // Real-time data
  crowdLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'unknown'],
    default: 'unknown'
  },
  crowdLastUpdated: {
    type: Date
  },
  safetyRating: {
    type: Number,
    min: 1,
    max: 5
  },
  safetyFactors: [String],
  safetyLastUpdated: {
    type: Date
  },
  
  // Metadata
  views: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for search
placeSchema.index({ name: 'text', description: 'text', tags: 'text' });
placeSchema.index({ category: 1, city: 1 });
placeSchema.index({ coordinates: '2dsphere' });
placeSchema.index({ rating: -1 });
placeSchema.index({ price: 1 });

// Update review count and average rating before save
placeSchema.pre('save', function(next) {
  if (this.reviews.length > 0) {
    this.reviewCount = this.reviews.length;
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating = totalRating / this.reviews.length;
  }
  next();
});

module.exports = mongoose.model('Place', placeSchema);