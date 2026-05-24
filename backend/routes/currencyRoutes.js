const express = require('express');
const router = express.Router();
const { getExchangeRates, convertCurrency } = require('../utils/currency');

// Get all exchange rates (for frontend to use)
router.get('/rates', async (req, res) => {
  try {
    const rates = await getExchangeRates();
    res.json(rates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Convert a specific amount
router.get('/convert', async (req, res) => {
  try {
    const { amount, from, to } = req.query;
    if (!amount || !from || !to) return res.status(400).json({ error: 'Missing params' });
    const converted = await convertCurrency(Number(amount), from, to);
    res.json({ amount: converted });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
