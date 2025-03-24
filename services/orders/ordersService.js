const express = require('express');
const router = express.Router();
const { ordersDb } = require('../../config/database');

// Get all orders
router.get('/', (req, res) => {
    ordersDb.all('SELECT * FROM orders', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Get order by ID with its items
router.get('/:id', (req, res) => {
    const orderId = req.params.id;
    ordersDb.get('SELECT * FROM orders WHERE id = ?', [orderId], (err, order) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!order) {
            res.status(404).json({ error: 'Order not found' });
            return;
        }
        ordersDb.all('SELECT * FROM order_items WHERE order_id = ?', [orderId], (err, items) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            order.items = items;
            res.json(order);
        });
    });
});

// Create a new order
router.post('/', (req, res) => {
    const { customer_name, total_amount, items } = req.body;
    
    if (!customer_name || !total_amount || !items || !items.length) {
        return res.status(400).json({ error: 'Customer name, total amount, and items are required' });
    }

    ordersDb.run('BEGIN TRANSACTION');
    
    ordersDb.run(
        'INSERT INTO orders (customer_name, total_amount) VALUES (?, ?)',
        [customer_name, total_amount],
        function(err) {
            if (err) {
                ordersDb.run('ROLLBACK');
                res.status(500).json({ error: err.message });
                return;
            }
            
            const orderId = this.lastID;
            let completed = 0;
            
            items.forEach(item => {
                ordersDb.run(
                    'INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES (?, ?, ?, ?)',
                    [orderId, item.menu_item_id, item.quantity, item.price],
                    (err) => {
                        if (err) {
                            ordersDb.run('ROLLBACK');
                            res.status(500).json({ error: err.message });
                            return;
                        }
                        completed++;
                        if (completed === items.length) {
                            ordersDb.run('COMMIT');
                            res.status(201).json({
                                id: orderId,
                                customer_name,
                                total_amount,
                                items
                            });
                        }
                    }
                );
            });
        }
    );
});

// Update order status
router.put('/:id/status', (req, res) => {
    const { status } = req.body;
    
    if (!status) {
        return res.status(400).json({ error: 'Status is required' });
    }

    ordersDb.run(
        'UPDATE orders SET status = ? WHERE id = ?',
        [status, req.params.id],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            if (this.changes === 0) {
                res.status(404).json({ error: 'Order not found' });
                return;
            }
            res.json({ message: 'Order status updated successfully' });
        }
    );
});

module.exports = router;