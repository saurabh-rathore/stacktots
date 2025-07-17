const request = require('supertest');
const express = require('express');
const contentRoutes = require('../routes/content');

const app = express();
app.use(express.json());
app.use('/api/content', contentRoutes);

// Mock the verifyToken middleware
jest.mock('../middleware/verifyToken', () => (req, res, next) => {
  req.userId = 1;
  next();
});

describe('Content Endpoints', () => {
  it('should get all content', async () => {
    const res = await request(app).get('/api/content');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should create new content', async () => {
    const res = await request(app)
      .post('/api/content')
      .send({
        title: 'New Content',
        description: 'This is new content',
        type: 'story',
        filePath: '/uploads/new-content.pdf',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Content created successfully');
  });
});
