const request = require('supertest');
const app = require('../src/app');

describe('BOOM.COM E-Commerce & DevOps CI/CD Test Suite', () => {

  // Test GET /
  describe('GET /', () => {
    it('should return application metadata and 200 status code for API requests', async () => {
      const response = await request(app)
        .get('/')
        .set('Accept', 'application/json');

      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toHaveProperty('application', 'nodejs-cicd-app');
      expect(response.body).toHaveProperty('version', '1.0.0');
      expect(response.body).toHaveProperty('environment');
      expect(response.body).toHaveProperty('message');
    });

    it('should serve HTML dashboard when requested with text/html accept header', async () => {
      const response = await request(app)
        .get('/')
        .set('Accept', 'text/html,application/xhtml+xml');

      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toMatch(/html/);
    });
  });

  // Test GET /health
  describe('GET /health', () => {
    it('should return status UP and 200 OK for health checks', async () => {
      const response = await request(app).get('/health');

      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toEqual({
        status: 'UP'
      });
    });
  });

  // Test GET /api/users
  describe('GET /api/users', () => {
    it('should return a list of users with 200 status code', async () => {
      const response = await request(app).get('/api/users');

      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('email');
    });
  });

  // Test GET /api/products (BOOM.COM Store)
  describe('GET /api/products', () => {
    it('should return products catalog for BOOM.COM e-commerce store', async () => {
      const response = await request(app).get('/api/products');

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('store', 'BOOM.COM');
      expect(Array.isArray(response.body.products)).toBe(true);
      expect(response.body.products.length).toBeGreaterThan(0);
    });

    it('should filter products by category', async () => {
      const response = await request(app).get('/api/products?category=Gaming');

      expect(response.statusCode).toBe(200);
      expect(response.body.products.every(p => p.category === 'Gaming')).toBe(true);
    });
  });

});
