const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Login Route (For both Owner and Salesperson)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      'your_jwt_secret', 
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      username: user.username,
      role: user.role,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Register Owner
router.post('/register-owner', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create new owner user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newOwner = new User({
      username,
      email,
      password: hashedPassword,
      role: 'owner', // Assign owner role
    });

    await newOwner.save();
    res.status(201).json({ message: 'Owner registered successfully' });
  } catch (error) {
    console.error('Owner registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Register Salesperson
router.post('/register-salesperson', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create new salesperson user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newSalesperson = new User({
      username,
      email,
      password: hashedPassword,
      role: 'salesperson', // Assign salesperson role
    });

    await newSalesperson.save();
    res.status(201).json({ message: 'Salesperson registered successfully' });
  } catch (error) {
    console.error('Salesperson registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
