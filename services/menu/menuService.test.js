const request = require('supertest');
const express = require('express');
const sqlite3 = require('sqlite3');
const menuService = require('./menuService');

// Mock the database module
jest.mock('../../config/database', () => ({
  menuDb: {
    all: jest.fn(),
    run: jest.fn()
  }
}));

const { menuDb } = require('../../config/database');

const app = express();
app.use(express.json());
app.use('/', menuService);

describe('Menu Service API', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });



  describe('GET /menu', () => {
    it('should return all menu items', async () => {
      const mockMenuItems = [
        { id: 1, name: 'Test Item 1', price: 9.99, description: 'Test Description 1' },
        { id: 2, name: 'Test Item 2', price: 14.99, description: 'Test Description 2' }
      ];

      menuDb.all.mockImplementation((query, params, callback) => {
        callback(null, mockMenuItems);
      });

      const response = await request(app).get('/menu');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toEqual(mockMenuItems);
    });
  });

  describe('POST /menu', () => {
    it('should create a new menu item', async () => {
      const newItem = {
        name: 'New Item',
        price: 19.99,
        description: 'New Description'
      };

      menuDb.run.mockImplementation((query, params, callback) => {
        callback.call({ lastID: 1 }, null);
      });

      const response = await request(app)
        .post('/menu')
        .send(newItem);

      expect(response.status).toBe(201);
      expect(response.body.id).toBe(1);
      expect(response.body.name).toBe(newItem.name);
      expect(response.body.price).toBe(newItem.price);
      expect(response.body.description).toBe(newItem.description);
    });
  });
});