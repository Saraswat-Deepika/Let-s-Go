const request = require('supertest');
const app = require('./App');

describe('Smart City Guide API', () => {
  
  describe('Health Check', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('OK');
    });
  });

  describe('Auth Routes', () => {
    it('should return 404 for non-existent route', async () => {
      const res = await request(app).get('/api/nonexistent');
      expect(res.statusCode).toBe(404);
    });
  });

  describe('Error Handling', () => {
    it('should handle JSON parsing errors', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send('invalid json')
        .set('Content-Type', 'application/json');
      
      expect(res.statusCode).toBe(400);
    });
  });
});