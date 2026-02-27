const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

// Get user preferences
router.get('/preferences', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        res.json(user.preferences);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update user preferences
router.put('/preferences', verifyToken, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { $set: { preferences: req.body } },
            { new: true }
        );
        res.json(user.preferences);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get user favorites
router.get('/favorites', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).populate('favorites');
        res.json(user.favorites);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Add to favorites
router.post('/favorites', verifyToken, async (req, res) => {
    try {
        const { placeId } = req.body;
        const user = await User.findById(req.user.userId);
        if (!user.favorites.includes(placeId)) {
            user.favorites.push(placeId);
            await user.save();
        }
        res.json({ success: true, favorites: user.favorites });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Remove from favorites
router.delete('/favorites/:placeId', verifyToken, async (req, res) => {
    try {
        const { placeId } = req.params;
        const user = await User.findById(req.user.userId);
        user.favorites = user.favorites.filter(id => id.toString() !== placeId);
        await user.save();
        res.json({ success: true, favorites: user.favorites });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
