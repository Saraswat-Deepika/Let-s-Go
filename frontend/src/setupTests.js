// Jest testing setup
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';

// Increase timeout for tests
jest.setTimeout(30000);

// Setup MongoDB Memory Server
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Clear database between tests
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});

// Mock console methods during tests (optional)
// global.console = {
//   ...console,
//   log: jest.fn(),
//   debug: jest.fn(),
//   info: jest.fn(),
//   warn: jest.fn(),
//   error: jest.fn(),
// };

// Custom matchers
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
});

// Global test utilities
global.testUtils = {
  // Generate random test user
  generateUser: () => ({
    name: `Test User ${Date.now()}`,
    email: `test${Date.now()}@example.com`,
    password: 'password123'
  }),
  
  // Generate random test place
  generatePlace: () => ({
    name: `Test Place ${Date.now()}`,
    description: 'A test place description',
    category: 'Cafe',
    location: 'Test Location',
    coordinates: {
      lat: 28.6139,
      lng: 77.2090
    },
    price: 200,
    rating: 4.5
  }),
  
  // Generate test todo
  generateTodo: () => ({
    title: `Test Todo ${Date.now()}`,
    description: 'Test description',
    date: new Date(),
    time: '10:00',
    priority: 'medium',
    type: 'general'
  })
};