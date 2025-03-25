const express = require('express');
const router = express.Router();
const { menuDb } = require('../../config/database');

// Get all menu items
router.get('/', (req, res) => {
    menuDb.all('SELECT * FROM menu_items', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Add a new menu item
router.post('/', (req, res) => {
    const { name, description, price, category } = req.body;
    
    if (!name || !price) {
        return res.status(400).json({ error: 'Name and price are required' });
    }

    const sql = 'INSERT INTO menu_items (name, description, price, category) VALUES (?, ?, ?, ?)';
    menuDb.run(sql, [name, description, price, category], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({
            id: this.lastID,
            name,
            description,
            price,
            category
        });
    });
});

// Update a menu item
router.put('/:id', (req, res) => {
    const { name, description, price, category } = req.body;
    
    if (!name || !price) {
        return res.status(400).json({ error: 'Name and price are required' });
    }

    const sql = 'UPDATE menu_items SET name = ?, description = ?, price = ?, category = ? WHERE id = ?';
    menuDb.run(sql, [name, description, price, category, req.params.id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Menu item not found' });
            return;
        }
        res.json({ message: 'Menu item updated successfully' });
    });
});

// Delete a menu item
router.delete('/menu/:id', (req, res) => {
    menuDb.run('DELETE FROM menu_items WHERE id = ?', req.params.id, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Menu item not found' });
            return;
        }
        res.json({ message: 'Menu item deleted successfully' });
    });
});

module.exports = router;