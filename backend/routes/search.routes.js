const express = require('express');
const router = express.Router();
const searchController = require('../controllers/search.controller');

// Main search
router.get('/', searchController.search);

// Autocomplete
router.get('/suggest', searchController.autocomplete);

// Popular searches
router.get('/popular', searchController.getPopularSearches);

// Trending
router.get('/trending', searchController.getTrending);

// Nearby places
router.get('/nearby', searchController.nearby);

module.exports = router;