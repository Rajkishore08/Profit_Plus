const express = require('express');
const Collection = require('../models/Collection');
const User = require('../models/User');
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

// Add Collection
router.post('/add-collection', async (req, res) => {
  const { billNumber, shopName, amount, remarks } = req.body;

  if (amount == null || amount <= 0) {
    return res.status(400).json({ message: 'Valid amount is required' });
  }

  try {
    const newCollection = new Collection({
      billNumber,
      shopName,
      amount: parseFloat(amount),
      remarks: remarks || '',
      username: req.username,
      collectedDate: new Date(),
    });

    const savedCollection = await newCollection.save();
    const user = await User.findOne({ username: savedCollection.username });

    res.status(200).json({
      message: 'Collection added successfully',
      collection: {
        ...savedCollection.toObject(),
        salespersonName: user ? user.username : 'Unknown',
      },
    });
  } catch (error) {
    console.error('Collection error:', error);
    res.status(400).json({ message: 'Error adding collection: ' + error.message });
  }
});

// Get All Collections
router.get('/', async (req, res) => {
  try {
    const collections = await Collection.find().sort({ createdAt: -1 });
    const users = await User.find();
    const userMap = users.reduce((map, user) => {
      map[user.username] = user.username;
      return map;
    }, {});

    const collectionsWithNames = collections.map((collection) => ({
      ...collection.toObject(),
      salespersonName: userMap[collection.username] || 'Unknown',
    }));

    res.status(200).json(collectionsWithNames);
  } catch (error) {
    console.error('Fetch collections error:', error);
    res.status(500).json({ message: 'Error fetching collections: ' + error.message });
  }
});

module.exports = router;