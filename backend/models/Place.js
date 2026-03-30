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
    enum: ['Temple', 'Cafe', 'Stay', 'Ghat', 'Attraction', 'Emergency', 'Restaurant', 'Park', 'Museum', 'Market', 'Event', 'College', 'Transport', 'Hotel', 'Hostel', 'Other']
  },
  subcategory: {
    type: String,
    trim: true
  },
  
  // Flat fields for Agents and simple search
  city: {
    type: String,
    required: true,
    index: true
  },
  timings: String,
  entry_fee: {
    type: String,
    default: 'Free'
  },
  best_time: String,
  lat: Number,
  lng: Number,
  
  // Location
  location: {
    type: String, // Kept for backwards compatibility
    required: false
  },
  area: {
    type: String,
    required: true,
    default: 'Vrindavan'
  },
  address: {
    street: String,
    area: String,
    city: String, // Made optional as top-level city is primary
    state: String,
    pincode: String,
    country: {
      type: String,
      default: 'India'
    }
  },
  coordinates: {
    lat: Number,
    lng: Number
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
  // Vrindavan Agent Fields
  bestTime: String,
  suitableFor: [{
    type: String,
    enum: ['Students', 'Devotees', 'Tourists', 'Families', 'All']
  }],
  estimatedBudget: String,
  mapsKeyword: String,
  popularity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Very High', 'unknown'],
    default: 'Medium'
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
placeSchema.index({ name: 'text', description: 'text', tags: 'text', city: 'text' });
placeSchema.index({ category: 1, city: 1 });
placeSchema.index({ coordinates: '2dsphere' });
placeSchema.index({ rating: -1 });
placeSchema.index({ price: 1 });

// Update review count, average rating, and sync coordinates before save
placeSchema.pre('save', function(next) {
  // Sync coordinates
  if (this.lat && this.lng && (!this.coordinates || !this.coordinates.lat)) {
    this.coordinates = { lat: this.lat, lng: this.lng };
  } else if (this.coordinates && this.coordinates.lat && !this.lat) {
    this.lat = this.coordinates.lat;
    this.lng = this.coordinates.lng;
  }

  // Sync city
  if (this.city && (!this.address || !this.address.city)) {
    if (!this.address) this.address = {};
    this.address.city = this.city;
  } else if (this.address && this.address.city && !this.city) {
    this.city = this.address.city;
  }

  // Update review data
  if (this.reviews && this.reviews.length > 0) {
    this.reviewCount = this.reviews.length;
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating = totalRating / this.reviews.length;
  }
  next();
});

module.exports = mongoose.model('Place', placeSchema);