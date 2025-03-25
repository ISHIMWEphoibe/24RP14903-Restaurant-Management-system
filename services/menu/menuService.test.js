const request = require('supertest');
const express = require('express');
const menuService = require('./menuService');
const { menuDb } = require('../../config/database');

const app = express();
app.use(express.json());
app.use('/', menuService);

beforeEach(() => {
  jest.clearAllMocks();
  // Reset mock implementations
  menuDb.all.mockReset();
  menuDb.run.mockReset();
});

describe('Menu Service API', () => {
  describe('GET /', () => {
    it('should return all menu items', async () => {
      const mockMenuItems = [
        { id: 1, name: 'Test Item 1', price: 9.99, description: 'Test Description 1' },
        { id: 2, name: 'Test Item 2', price: 14.99, description: 'Test Description 2' }
      ];

      menuDb.all.mockImplementation((query, params, callback) => {
        callback(null, mockMenuItems);
      });

      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockMenuItems);
    });
  });

  describe('POST /', () => {
    it('should create a new menu item', async () => {
      const newItem = {
        name: 'New Item',
        price: 19.99,
        description: 'New Description',
        category: 'Test Category'
      };

      menuDb.run.mockImplementation((query, params, callback) => {
        if (callback) callback.call({ lastID: 1 });
      });

      const response = await request(app)
        .post('/')
        .send(newItem);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        id: 1,
        ...newItem
      });
    });

    it('should return 400 if name or price is missing', async () => {
      const invalidItem = {
        description: 'Invalid Item'
      };

      const response = await request(app)
        .post('/')
        .send(invalidItem);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Name and price are required');
    });
  });
});