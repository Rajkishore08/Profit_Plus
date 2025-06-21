const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Environment variables
const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      jwtSecret,
      { expiresIn: '24h' }
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

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.email === email ? 'Email already registered' : 'Username already taken' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newOwner = new User({
      username,
      email,
      password: hashedPassword,
      role: 'owner',
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

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.email === email ? 'Email already registered' : 'Username already taken' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newSalesperson = new User({
      username,
      email,
      password: hashedPassword,
      role: 'salesperson',
    });

    await newSalesperson.save();
    res.status(201).json({ message: 'Salesperson registered successfully' });
  } catch (error) {
    console.error('Salesperson registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;