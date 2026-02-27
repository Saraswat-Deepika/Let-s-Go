const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['crowd', 'safety', 'general'],
    required: true
  },
  place: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Crowd specific
  crowdLevel: {
    type: String,
    enum: ['low', 'medium', 'high']
  },
  waitTime: {
    type: String // e.g., "15 min"
  },
  
  // Safety specific
  safetyRating: {
    type: Number,
    min: 1,
    max: 5
  },
  safetyFactors: [String], // well-lit, crowded, police-nearby, etc.
  incidentReport: {
    type: Boolean,
    default: false
  },
  
  // General
  description: {
    type: String,
    maxlength: 500
  },
  
  timestamp: {
    type: Date,
    default: Date.now,
    expires: 86400 // Auto-delete after 24 hours for crowd reports
  }
});

// Index for efficient queries
ratingSchema.index({ place: 1, type: 1, timestamp: -1 });
ratingSchema.index({ user: 1 });

module.exports = mongoose.model('Rating', ratingSchema);