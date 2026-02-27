const app = require('./app');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║   🏙️  Smart City Guide API Server               ║
║                                                   ║
║   🚀 Server running on port ${PORT}                 ║
║   📁 Environment: ${process.env.NODE_ENV || 'development'}                    ║
║   🔗 API: http://localhost:${PORT}/api              ║
║                                                   ║
║   Available Endpoints:                            ║
║   • GET  /api/health                              ║
║   • GET  /api/places                              ║
║   • GET  /api/search                              ║
║   • POST /api/recommend/plan                      ║
║   • GET  /api/ratings/crowd/live                  ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
  console.log('Shutting down server...');
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  console.log('Shutting down server...');
  server.close(() => process.exit(1));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('💤 Process terminated');
  });
});