// Utility to calculate VAT/sales tax based on country
// For demo: simple mapping, real-world use a tax API/service

const TAX_RATES = {
  US: 0.07, // 7% sales tax
  DE: 0.19, // 19% VAT
  FR: 0.20, // 20% VAT
  GB: 0.20, // 20% VAT
  IN: 0.18, // 18% GST
  // ...add more as needed
};

function getTaxRate(countryCode) {
  return TAX_RATES[countryCode] || 0;
}

function calculateTax(amount, countryCode) {
  const rate = getTaxRate(countryCode);
  return {
    tax: +(amount * rate).toFixed(2),
    rate
  };
}

module.exports = { getTaxRate, calculateTax };
