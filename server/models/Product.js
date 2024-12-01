const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  grpname: String,
  compname: String,
  gst: Number,
  vatcode: String,
});

module.exports = mongoose.model('Product', productSchema);
