const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// Daily revenue for last 30 days
router.get('/revenue/daily', async (req, res) => {
  const days = 30;
  const data = await Order.aggregate([
    { $match: { paymentStatus: 'paid', createdAt: { $gte: new Date(Date.now() - days * 24*60*60*1000) } } },
    { $group: {
      _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
      revenue: { $sum: '$totalAmount' },
      count: { $sum: 1 }
    } },
    { $sort: { _id: 1 } }
  ]);
  res.json(data);
});

// Monthly revenue for last 12 months
router.get('/revenue/monthly', async (req, res) => {
  const data = await Order.aggregate([
    { $match: { paymentStatus: 'paid', createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth()-12)) } } },
    { $group: {
      _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
      revenue: { $sum: '$totalAmount' },
      count: { $sum: 1 }
    } },
    { $sort: { _id: 1 } }
  ]);
  res.json(data);
});

// Top-selling products
router.get('/top-products', async (req, res) => {
  const data = await Order.aggregate([
    { $match: { paymentStatus: 'paid' } },
    { $unwind: '$items' },
    { $group: {
      _id: '$items.product',
      totalSold: { $sum: '$items.quantity' },
      revenue: { $sum: '$items.price' }
    } },
    { $sort: { totalSold: -1 } },
    { $limit: 10 }
  ]);
  // Populate product details
  const products = await Product.find({ _id: { $in: data.map(d => d._id) } });
  const result = data.map(d => ({ ...d, product: products.find(p => p._id.equals(d._id)) }));
  res.json(result);
});

module.exports = router;
