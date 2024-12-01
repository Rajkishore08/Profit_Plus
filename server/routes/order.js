const express = require('express');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product'); // Import Product model
const Customer = require('../models/Customer'); // Import Customer model
const router = express.Router();
const jwt = require('jsonwebtoken');

// Middleware to extract username from token
const getUsernameFromToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'No token provided' });

  jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Unauthorized' });
    req.username = decoded.username;
    next();
  });
};

// Apply the middleware for routes that need username
router.use(getUsernameFromToken);

router.post('/add-order', async (req, res) => {
  const { shopName, items, status } = req.body;

  try {
    const newOrder = new Order({
      shopName,
      items, // Array of products with quantity
      status,
      username: req.username,
    });

    const savedOrder = await newOrder.save();
    const user = await User.findOne({ username: savedOrder.username });

    res.status(200).json({
      message: 'Order added successfully',
      order: {
        ...savedOrder.toObject(),
        salespersonName: user ? user.name : 'Unknown',
      },
    });
  } catch (error) {
    res.status(400).json({ message: 'Error adding order: ' + error.message });
  }
});


// Get All Orders
router.get('/all-orders', async (req, res) => {
  try {
    const orders = await Order.find();
    const users = await User.find();
    const userMap = users.reduce((map, user) => {
      map[user.username] = user.name;
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
    res.status(500).json({ message: 'Error fetching orders: ' + error.message });
  }
});


// Get All Products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products: ' + error.message });
  }
});

// Get All Customers
router.get('/customers', async (req, res) => {
  try {
    const customers = await Customer.find({});
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customers: ' + error.message });
  }
});

module.exports = router;
