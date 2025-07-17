const request = require('supertest');
const express = require('express');
const subscriptionRoutes = require('../routes/subscriptions');

const app = express();
app.use(express.json());
app.use('/api/subscriptions', subscriptionRoutes);

// Mock the verifyToken middleware
jest.mock('../middleware/verifyToken', () => (req, res, next) => {
  req.userId = 1;
  next();
});

describe('Subscription Endpoints', () => {
  it('should get all subscription plans', async () => {
    const res = await request(app).get('/api/subscriptions/plans');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
