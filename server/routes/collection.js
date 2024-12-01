const express = require('express');
const Collection = require('../models/Collection');
const User = require('../models/User');
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

// Add Collection
router.post('/add-collection', async (req, res) => {
  const { billNumber, shopName, amount, remarks } = req.body;

  if (amount == null) {
    return res.status(400).json({ message: 'Amount is required' });
  }

  try {
    const newCollection = new Collection({
      billNumber,
      shopName,
      amount,
      remarks,
      username: req.username,
      collectedDate: new Date(),
    });

    const savedCollection = await newCollection.save();
    const user = await User.findOne({ username: savedCollection.username });

    res.status(200).json({
      message: 'Collection added successfully',
      collection: {
        ...savedCollection.toObject(),
        salespersonName: user ? user.name : 'Unknown',
      },
    });
  } catch (error) {
    res.status(400).json({ message: 'Error adding collection: ' + error.message });
  }
});

// Get All Collections
router.get('/', async (req, res) => {
  try {
    const collections = await Collection.find();
    const users = await User.find();
    const userMap = users.reduce((map, user) => {
      map[user.username] = user.name;
      return map;
    }, {});

    const collectionsWithNames = collections.map((collection) => ({
      ...collection.toObject(),
      salespersonName: userMap[collection.username] || 'Unknown',
    }));

    res.status(200).json(collectionsWithNames);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching collections: ' + error.message });
  }
});

module.exports = router;
