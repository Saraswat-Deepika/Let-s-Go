const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = {
  // Verify JWT token
  verifyToken: async (req, res, next) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Access denied. No token provided.'
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      // Check if user still exists
      const user = await User.findById(decoded.userId).select('-password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found. Token invalid.'
        });
      }

      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role || 'user'
      };
      
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token'
        });
      }
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired'
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Server error in authentication'
      });
    }
  },

  // Optional authentication (doesn't fail if no token)
  optionalAuth: async (req, res, next) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = {
          userId: decoded.userId,
          email: decoded.email,
          role: decoded.role || 'user'
        };
      }
      
      next();
    } catch (error) {
      // Continue without user
      next();
    }
  },

  // Check if user is admin
  isAdmin: (req, res, next) => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }
    next();
  },

  // Check if user is owner or admin
  isOwnerOrAdmin: (resourceUserId) => {
    return (req, res, next) => {
      if (req.user?.role === 'admin' || req.user?.userId === resourceUserId.toString()) {
        return next();
      }
      
      res.status(403).json({
        success: false,
        message: 'Access denied. Not authorized.'
      });
    };
  },

  // Rate limiting helper (basic implementation)
  rateLimit: (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
    const requests = new Map();

    return (req, res, next) => {
      const userId = req.user?.userId || req.ip;
      const now = Date.now();
      
      if (!requests.has(userId)) {
        requests.set(userId, []);
      }
      
      const userRequests = requests.get(userId);
      
      // Remove old requests outside window
      const windowStart = now - windowMs;
      const recentRequests = userRequests.filter(time => time > windowStart);
      
      if (recentRequests.length >= maxRequests) {
        return res.status(429).json({
          success: false,
          message: 'Too many requests. Please try again later.'
        });
      }
      
      recentRequests.push(now);
      requests.set(userId, recentRequests);
      
      next();
    };
  }
};

module.exports = auth;