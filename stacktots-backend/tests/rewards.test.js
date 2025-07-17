const request = require('supertest');
const express = require('express');
const rewardsRoutes = require('../routes/rewards');

const app = express();
app.use(express.json());
app.use('/api/rewards', rewardsRoutes);

// Mock the verifyToken middleware
jest.mock('../middleware/verifyToken', () => (req, res, next) => {
  req.userId = 1;
  next();
});

describe('Rewards Endpoints', () => {
  it('should get all rewards', async () => {
    const res = await request(app).get('/api/rewards');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get user points', async () => {
    const res = await request(app).get('/api/rewards/points');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('points');
  });
});
