// server.js
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/order');
const collectionRoutes = require('./routes/collection');
const customerRoutes = require('./routes/customerRoutes'); // Route for customers
const productRoutes = require('./routes/productRoutes'); // Route for products
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/customers', customerRoutes); // Added customer route
app.use('/api/products', productRoutes); // Added product route

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
