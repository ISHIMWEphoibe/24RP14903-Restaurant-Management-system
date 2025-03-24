const express = require('express');
const app = express();
const menuService = require('./services/menu/menuService');
const ordersService = require('./services/orders/ordersService');

// Middleware for parsing JSON bodies
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Restaurant Management System' });
});

// Register microservices
app.use('/api/menu', menuService);
app.use('/api/orders', ordersService);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('Available endpoints:');
    console.log('  - GET    /api/menu');
    console.log('  - POST   /api/menu');
    console.log('  - PUT    /api/menu/:id');
    console.log('  - DELETE /api/menu/:id');
    console.log('  - GET    /api/orders');
    console.log('  - GET    /api/orders/:id');
    console.log('  - POST   /api/orders');
    console.log('  - PUT    /api/orders/:id/status');
});