const express = require('express');
const Customer = require('../models/Customer');
const router = express.Router();

// Get all customers
router.get('/customers', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customers.' });
  }
});

module.exports = router;
