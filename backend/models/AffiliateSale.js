const mongoose = require('mongoose');

const affiliateSaleSchema = new mongoose.Schema({
  affiliate: { type: mongoose.Schema.Types.ObjectId, ref: 'Affiliate', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  commission: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('AffiliateSale', affiliateSaleSchema);
