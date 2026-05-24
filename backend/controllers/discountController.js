const DiscountCode = require('../models/DiscountCode');
const User = require('../models/User');

// Create a new discount code
exports.createDiscountCode = async (req, res) => {
  try {
    const { code, type, value, expiresAt, usageLimit } = req.body;
    const creator = req.user._id;
    const discount = await DiscountCode.create({
      code,
      creator,
      type,
      value,
      expiresAt,
      usageLimit
    });
    res.status(201).json(discount);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all discount codes for a creator
exports.getCreatorDiscountCodes = async (req, res) => {
  try {
    const codes = await DiscountCode.find({ creator: req.user._id });
    res.json(codes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Validate and apply a discount code
exports.applyDiscountCode = async (req, res) => {
  try {
    const { code } = req.body;
    const discount = await DiscountCode.findOne({ code, active: true });
    if (!discount) return res.status(404).json({ error: 'Invalid code' });
    if (discount.expiresAt < new Date()) return res.status(400).json({ error: 'Code expired' });
    if (discount.usageLimit && discount.usedCount >= discount.usageLimit) return res.status(400).json({ error: 'Code usage limit reached' });
    res.json(discount);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Mark code as used (to be called after successful order)
exports.markDiscountCodeUsed = async (code) => {
  await DiscountCode.findOneAndUpdate(
    { code },
    { $inc: { usedCount: 1 } }
  );
};

// Get available public discount codes
exports.getPublicDiscountCodes = async (req, res) => {
  try {
    const activeCodes = await DiscountCode.find({
      active: true,
      expiresAt: { $gt: new Date() }
    }).select('code type value expiresAt usageLimit usedCount');

    // Filter out codes that have reached their limit
    const validCodes = activeCodes.filter(c => !c.usageLimit || c.usedCount < c.usageLimit);

    res.json(validCodes.map(c => ({
      _id: c._id,
      code: c.code,
      type: c.type,
      value: c.value,
      expiresAt: c.expiresAt
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
