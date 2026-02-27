const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  avatar: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  
  // Preferences
  preferences: {
    budget: {
      type: String,
      enum: ['low', 'medium', 'high', 'luxury'],
      default: 'medium'
    },
    interests: [String],
    dietaryRestrictions: [String],
    accessibility: {
      type: Boolean,
      default: false
    }
  },
  
  // Social
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place'
  }],
  
  // History
  planHistory: [{
    plan: Object,
    city: String,
    mood: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  searchHistory: [String],
  
  // Metadata
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);