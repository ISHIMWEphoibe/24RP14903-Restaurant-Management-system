const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database connections for different services
const menuDb = new sqlite3.Database(path.join(__dirname, '../data/menu.db'), (err) => {
    if (err) {
        console.error('Error connecting to menu database:', err);
    } else {
        console.log('Connected to menu database');
        // Create menu table if it doesn't exist
        menuDb.run(`CREATE TABLE IF NOT EXISTS menu_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            price REAL NOT NULL,
            category TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

const ordersDb = new sqlite3.Database(path.join(__dirname, '../data/orders.db'), (err) => {
    if (err) {
        console.error('Error connecting to orders database:', err);
    } else {
        console.log('Connected to orders database');
        // Create orders table if it doesn't exist
        ordersDb.run(`CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_name TEXT NOT NULL,
            total_amount REAL NOT NULL,
            status TEXT DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
        
        // Create order items table if it doesn't exist
        ordersDb.run(`CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER,
            menu_item_id INTEGER,
            quantity INTEGER NOT NULL,
            price REAL NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders (id)
        )`);
    }
});

module.exports = {
    menuDb,
    ordersDb
};