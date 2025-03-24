const { menuDb, ordersDb } = require('../config/database');

// Insert menu items
const menuItems = [
    { name: 'Classic Burger', description: 'Juicy beef patty with lettuce and tomato', price: 12.99, category: 'Main Course' },
    { name: 'Margherita Pizza', description: 'Fresh tomatoes, mozzarella, and basil', price: 14.99, category: 'Main Course' },
    { name: 'Caesar Salad', description: 'Crisp romaine lettuce with Caesar dressing', price: 8.99, category: 'Starters' },
    { name: 'French Fries', description: 'Crispy golden fries with sea salt', price: 4.99, category: 'Sides' },
    { name: 'Chocolate Cake', description: 'Rich chocolate layer cake', price: 6.99, category: 'Desserts' },
    { name: 'Iced Tea', description: 'Fresh brewed sweet tea', price: 2.99, category: 'Beverages' }
];

// Insert orders and order items
const orders = [
    {
        customer_name: 'John Smith',
        total_amount: 31.97,
        status: 'completed',
        items: [
            { menu_item_id: 1, quantity: 2, price: 12.99 },
            { menu_item_id: 4, quantity: 1, price: 4.99 }
        ]
    },
    {
        customer_name: 'Alice Johnson',
        total_amount: 23.98,
        status: 'pending',
        items: [
            { menu_item_id: 2, quantity: 1, price: 14.99 },
            { menu_item_id: 3, quantity: 1, price: 8.99 }
        ]
    },
    {
        customer_name: 'Bob Wilson',
        total_amount: 17.97,
        status: 'in-progress',
        items: [
            { menu_item_id: 5, quantity: 1, price: 6.99 },
            { menu_item_id: 6, quantity: 2, price: 2.99 }
        ]
    }
];

// Insert menu items
menuItems.forEach(item => {
    menuDb.run(
        'INSERT INTO menu_items (name, description, price, category) VALUES (?, ?, ?, ?)',
        [item.name, item.description, item.price, item.category],
        (err) => {
            if (err) {
                console.error('Error inserting menu item:', err);
            }
        }
    );
});

// Insert orders and their items
orders.forEach(order => {
    ordersDb.run(
        'INSERT INTO orders (customer_name, total_amount, status) VALUES (?, ?, ?)',
        [order.customer_name, order.total_amount, order.status],
        function(err) {
            if (err) {
                console.error('Error inserting order:', err);
                return;
            }
            
            const orderId = this.lastID;
            
            // Insert order items
            order.items.forEach(item => {
                ordersDb.run(
                    'INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES (?, ?, ?, ?)',
                    [orderId, item.menu_item_id, item.quantity, item.price],
                    (err) => {
                        if (err) {
                            console.error('Error inserting order item:', err);
                        }
                    }
                );
            });
        }
    );
});

console.log('Dummy data insertion started...');