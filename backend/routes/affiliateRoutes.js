const Affiliate = require('../models/Affiliate');
const AffiliateSale = require('../models/AffiliateSale');
const Order = require('../models/Order');
const User = require('../models/User');
const crypto = require('crypto');
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const creatorOnly = require('../middleware/creatorOnly');
const asyncHandler = require('express-async-handler');

// Creator: generate affiliate link
router.post('/generate', protect, creatorOnly, asyncHandler(async (req, res) => {
  const code = crypto.randomBytes(6).toString('hex');
  const affiliate = await Affiliate.create({
    code,
    creator: req.user._id,
    commissionRate: req.body.commissionRate || 0.1,
  });
  res.json({ code: affiliate.code, commissionRate: affiliate.commissionRate });
}));

// Get all affiliate links for creator
router.get('/my-links', protect, creatorOnly, asyncHandler(async (req, res) => {
  const links = await Affiliate.find({ creator: req.user._id });
  res.json(links);
}));

// Track affiliate click (to be called on landing page with ?ref=code)
router.get('/track', asyncHandler(async (req, res) => {
  const { ref } = req.query;
  if (!ref) return res.status(400).json({ error: 'Missing ref' });
  await Affiliate.findOneAndUpdate({ code: ref }, { $inc: { totalClicks: 1 } });
  res.json({ success: true });
}));

module.exports = router;
