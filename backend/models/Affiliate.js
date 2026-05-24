const mongoose = require('mongoose');

const affiliateSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  commissionRate: { type: Number, default: 0.1 }, // 10% default
  totalClicks: { type: Number, default: 0 },
  totalSales: { type: Number, default: 0 },
  totalCommission: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Affiliate', affiliateSchema);
