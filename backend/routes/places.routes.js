const express = require('express');
const router = express.Router();
const placesController = require('../controllers/places.controller');
const auth = require('../middleware/auth');
const multer = require('multer');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/places/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Public routes
router.get('/', placesController.getAllPlaces);
router.get('/featured', placesController.getFeaturedPlaces);
router.get('/category/:category', placesController.getPlacesByCategory);
router.get('/:id', placesController.getPlaceById);

// Protected routes
router.post('/', 
  auth.verifyToken, 
  upload.single('image'), 
  placesController.createPlace
);

router.put('/:id', 
  auth.verifyToken, 
  upload.single('image'), 
  placesController.updatePlace
);

router.delete('/:id', 
  auth.verifyToken, 
  placesController.deletePlace
);

router.post('/:id/favorite', 
  auth.verifyToken, 
  placesController.toggleFavorite
);

router.get('/user/favorites', 
  auth.verifyToken, 
  placesController.getFavorites
);

router.post('/:id/reviews', 
  auth.verifyToken, 
  placesController.addReview
);

module.exports = router;