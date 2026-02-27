const express = require('express');
const router = express.Router();
const ratingsController = require('../controllers/ratings.controller');
const auth = require('../middleware/auth');

// Public routes
router.get('/crowd/live', ratingsController.getLiveCrowdStatus);
router.get('/safety/map', ratingsController.getSafetyMap);
router.get('/place/:placeId', ratingsController.getPlaceRatings);

// Protected routes
router.post('/crowd', 
  auth.verifyToken, 
  ratingsController.submitCrowdReport
);

router.post('/safety', 
  auth.verifyToken, 
  ratingsController.submitSafetyReport
);

module.exports = router;