const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  billNumber: {
    type: String,
    required: true,
  },
  shopName: {
    type: String,
    required: true,
  },
  amount: { // Ensure amount is required
    type: Number,
    required: true,
  },
  remarks: {
    type: String,
    required: false,
  },
  username: {
    type: String,
    required: true,
  },
  collectedDate: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const Collection = mongoose.model('Collection', collectionSchema);
module.exports = Collection;
