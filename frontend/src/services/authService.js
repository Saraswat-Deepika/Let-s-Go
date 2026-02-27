const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthService {
  // Register new user
  async register(userData) {
    try {
      const { name, email, password } = userData;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      const user = new User({
        name,
        email,
        password: hashedPassword,
        preferences: {
          budget: 'medium',
          interests: [],
          dietaryRestrictions: [],
          accessibility: false
        }
      });

      await user.save();

      // Generate JWT token
      const token = this.generateToken(user);

      return {
        success: true,
        token,
        user: this.sanitizeUser(user)
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Login user
  async login(email, password) {
    try {
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error('Invalid email or password');
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate JWT token
      const token = this.generateToken(user);

      return {
        success: true,
        token,
        user: this.sanitizeUser(user)
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Get user by ID
  async getUserById(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      return this.sanitizeUser(user);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Update user profile
  async updateProfile(userId, updateData) {
    try {
      const allowedUpdates = ['name', 'preferences', 'avatar'];
      const updates = {};

      Object.keys(updateData).forEach(key => {
        if (allowedUpdates.includes(key)) {
          updates[key] = updateData[key];
        }
      });

      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true, runValidators: true }
      );

      if (!user) {
        throw new Error('User not found');
      }

      return this.sanitizeUser(user);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Change password
  async changePassword(userId, oldPassword, newPassword) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        throw new Error('Current password is incorrect');
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();

      return { success: true, message: 'Password updated successfully' };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Generate JWT Token
  generateToken(user) {
    return jwt.sign(
      { 
        userId: user._id, 
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
  }

  // Remove sensitive data from user object
  sanitizeUser(user) {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      preferences: user.preferences,
      favorites: user.favorites,
      role: user.role,
      createdAt: user.createdAt
    };
  }

  // Verify token
  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

module.exports = new AuthService();