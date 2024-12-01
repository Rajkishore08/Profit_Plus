const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  shopName: { type: String, required: true },
  addr1: String,
  addr2: String,
  addr3: String,
  mobile: String,
});

module.exports = mongoose.model('Customer', customerSchema);
