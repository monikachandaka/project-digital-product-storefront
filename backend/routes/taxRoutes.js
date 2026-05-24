const express = require('express');
const router = express.Router();
const { calculateTax } = require('../utils/tax');

// Calculate tax for a given amount and country
router.get('/calculate', (req, res) => {
  const { amount, country } = req.query;
  if (!amount || !country) return res.status(400).json({ error: 'Missing params' });
  const result = calculateTax(Number(amount), country);
  res.json(result);
});

module.exports = router;
