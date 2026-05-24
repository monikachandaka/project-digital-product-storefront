// Utility to fetch exchange rates from a public API (e.g., exchangerate-api.com)
const axios = require('axios');

const API_URL = 'https://api.exchangerate-api.com/v4/latest/USD';

let cachedRates = null;
let lastFetched = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

async function getExchangeRates() {
  const now = Date.now();
  if (cachedRates && now - lastFetched < CACHE_DURATION) {
    return cachedRates;
  }
  const res = await axios.get(API_URL);
  cachedRates = res.data.rates;
  lastFetched = now;
  return cachedRates;
}

async function convertCurrency(amount, from, to) {
  const rates = await getExchangeRates();
  if (!rates[from] || !rates[to]) throw new Error('Unsupported currency');
  const usdAmount = from === 'USD' ? amount : amount / rates[from];
  return usdAmount * rates[to];
}

module.exports = { getExchangeRates, convertCurrency };
