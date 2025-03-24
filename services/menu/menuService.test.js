const request = require('supertest');
const express = require('express');
const { menuDb } = require('../../config/database');
const menuService = require('./menuService');

const app = express();
app.use(express.json());
app.use('/', menuService);

describe('Menu Service API', () => {
  beforeAll((done) => {
    menuDb.run('DROP TABLE IF EXISTS menu_items', (err) => {
      if (err) return done(err);
      menuDb.run(`CREATE TABLE menu_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        category TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, done);
    });
  });

  afterAll((done) => {
    menuDb.run('DROP TABLE IF EXISTS menu_items', done);
  });

  beforeEach((done) => {
    menuDb.run('DELETE FROM menu_items', (err) => {
      if (err) return done(err);
      menuDb.run(`INSERT INTO menu_items (name, price, description) VALUES 
        ('Test Item 1', 9.99, 'Test Description 1'),
        ('Test Item 2', 14.99, 'Test Description 2')
      `, done);
    });
  });

  describe('GET /menu', () => {
    it('should return all menu items', async () => {
      const response = await request(app).get('/menu');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0].name).toBe('Test Item 1');
      expect(response.body[0].price).toBe(9.99);
      expect(response.body[0].description).toBe('Test Description 1');
    });
  });

  describe('POST /menu', () => {
    it('should create a new menu item', async () => {
      const newItem = {
        name: 'New Item',
        price: 19.99,
        description: 'New Description'
      };

      const response = await request(app)
        .post('/menu')
        .send(newItem);

      expect(response.status).toBe(201);
      expect(response.body.id).toBeDefined();
      expect(response.body.name).toBe(newItem.name);
      expect(response.body.price).toBe(newItem.price);
      expect(response.body.description).toBe(newItem.description);
    });
  });
});