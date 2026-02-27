{
  "name": "smart-city-guide-backend",
  "version": "1.0.0",
  "description": "Cloud-based intelligent travel platform backend",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest --coverage",
    "test:watch": "jest --watch",
    "lint": "eslint .",
    "seed": "node scripts/seed.js"
  },
  "keywords": [
    "smart-city",
    "travel",
    "mern",
    "nodejs",
    "express"
  ],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "helmet": "^7.1.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.0.0",
    "morgan": "^1.10.0",
    "multer": "^1.4.5-lts.1",
    "openai": "^4.20.0",
    "socket.io": "^4.7.0",
    "express-validator": "^7.0.1"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "nodemon": "^3.0.1",
    "supertest": "^6.3.3",
    "mongodb-memory-server": "^9.1.0",
    "eslint": "^8.54.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}