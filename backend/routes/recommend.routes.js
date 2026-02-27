const express = require('express');
const router = express.Router();
const recommendController = require('../controllers/recommend.controller');
const auth = require('../middleware/auth');

// AI Day Planner (optional auth for saving history)
router.post('/plan', 
  auth.optionalAuth, 
  recommendController.generateDayPlan
);

// Mood-based discovery
router.get('/mood', recommendController.getMoodRecommendations);

// Personalized recommendations (requires auth)
router.get('/personalized', 
  auth.verifyToken, 
  recommendController.getPersonalizedRecommendations
);

// Similar places
router.get('/similar/:placeId', recommendController.getSimilarPlaces);

module.exports = router;