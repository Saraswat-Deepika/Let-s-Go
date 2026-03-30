const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// CORS
app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Logging
app.use(morgan('dev'));
app.use((req, res, next) => {
  if (req.method === 'POST') {
    console.log(`POST ${req.path}`, req.body);
  }
  next();
});

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/user', require('./routes/user.routes'));
app.use('/api/places', require('./routes/places.routes'));
app.use('/api/ratings', require('./routes/ratings.routes'));
app.use('/api/recommend', require('./routes/recommend.routes'));
app.use('/api/search', require('./routes/search.routes'));
app.use('/api/external', require('./routes/external.routes'));

// Aliases for frontend compatibility
app.use('/api/ai', require('./routes/recommend.routes')); // Plan
app.use('/api/crowd', require('./routes/ratings.routes')); // Live Crowd
app.use('/api/safety', require('./routes/ratings.routes')); // Safety Map

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// TEMPORARY SEED ROUTE
app.get('/api/seed', async (req, res) => {
  try {
    const { seedRealData } = require('./seedRealData');
    
    // This will clear and re-seed the database
    // Note: This might take a few seconds
    await seedRealData();
    
    res.json({ 
      success: true, 
      message: "Database seeded successfully with HD images!",
      note: "You can now check Banke Bihari or Prem Mandir details."
    });
  } catch (err) {
    console.error("Seeding error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;