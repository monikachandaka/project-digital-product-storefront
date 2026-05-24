const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  optIn: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  source: { type: String, default: 'checkout' },
});

module.exports = mongoose.model('Customer', customerSchema);
