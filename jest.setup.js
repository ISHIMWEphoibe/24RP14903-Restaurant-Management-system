const sqlite3 = require('sqlite3').verbose();
const { menuDb } = require('./config/database');

beforeAll(async () => {
  // Close the existing database connection
  await new Promise((resolve, reject) => {
    menuDb.close((err) => {
      if (err) reject(err);
      resolve();
    });
  });

  // Create an in-memory database for testing
  const testDb = new sqlite3.Database(':memory:', (err) => {
    if (err) {
      console.error('Error creating test database:', err);
    } else {
      console.log('Connected to test database');
    }
  });

  // Replace the menuDb with the test database
  global.menuDb = testDb;

  // Create the menu_items table
  await new Promise((resolve, reject) => {
    testDb.run(`CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      category TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
});

afterAll(async () => {
  // Close the test database connection
  await new Promise((resolve, reject) => {
    global.menuDb.close((err) => {
      if (err) reject(err);
      resolve();
    });
  });
});