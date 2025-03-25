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
const MAX_PORT_RETRIES = 10;

function startServer(port, retryCount = 0) {
    const server = app.listen(port)
        .on('error', (err) => {
            if (err.code === 'EADDRINUSE' && retryCount < MAX_PORT_RETRIES) {
                console.log(`Port ${port} is in use, trying port ${port + 1}...`);
                server.close();
                startServer(port + 1, retryCount + 1);
            } else {
                console.error('Failed to start server:', err.message);
                process.exit(1);
            }
        })
        .on('listening', () => {
            console.log(`Server is running on port ${port}`);
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