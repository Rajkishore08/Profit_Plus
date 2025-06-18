const express = require('express');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Middleware to extract username from token
const getUsernameFromToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Unauthorized' });
    req.username = decoded.username;
    req.userId = decoded.id;
    next();
  });
};

// Apply the middleware for routes that need username
router.use(getUsernameFromToken);

// Add Order
router.post('/add-order', async (req, res) => {
  const { shopName, items, status } = req.body;

  try {
    if (!shopName || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Shop name and items are required' });
    }

    // Validate items
    for (const item of items) {
      if (!item.productName || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({ message: 'Each item must have a valid product name and quantity' });
      }
    }

    const newOrder = new Order({
      shopName,
      items,
      status: status || 'pending',
      username: req.username,
    });

    const savedOrder = await newOrder.save();
    const user = await User.findOne({ username: savedOrder.username });

    res.status(200).json({
      message: 'Order added successfully',
      order: {
        ...savedOrder.toObject(),
        salespersonName: user ? user.username : 'Unknown',
      },
    });
  } catch (error) {
    console.error('Order error:', error);
    res.status(400).json({ message: 'Error adding order: ' + error.message });
  }
});

// Get All Orders
router.get('/all-orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    const users = await User.find();
    const userMap = users.reduce((map, user) => {
      map[user.username] = user.username;
      return map;
    }, {});

    const ordersWithDetails = orders.map((order) => ({
      ...order.toObject(),
      salespersonName: userMap[order.username] || 'Unknown',
      items: order.items.map((item) => ({
        productName: item.productName,
        quantity: item.quantity,
      })),
    }));

    res.status(200).json(ordersWithDetails);
  } catch (error) {
    console.error('Fetch orders error:', error);
    res.status(500).json({ message: 'Error fetching orders: ' + error.message });
  }
});

// Get All Products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find({});
    // Transform to match expected format
    const formattedProducts = products.map(product => ({
      ...product.toObject(),
      'Product Name': product.productName || product['Product Name']
    }));
    res.status(200).json(formattedProducts);
  } catch (error) {
    console.error('Fetch products error:', error);
    res.status(500).json({ message: 'Error fetching products: ' + error.message });
  }
});

// Get All Customers
router.get('/customers', async (req, res) => {
  try {
    const customers = await Customer.find({});
    // Transform to match expected format
    const formattedCustomers = customers.map(customer => ({
      ...customer.toObject(),
      'Shop Name': customer.shopName || customer['Shop Name']
    }));
    res.status(200).json(formattedCustomers);
  } catch (error) {
    console.error('Fetch customers error:', error);
    res.status(500).json({ message: 'Error fetching customers: ' + error.message });
  }
});

module.exports = router;