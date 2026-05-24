const Customer = require('../models/Customer');

// Save customer if opted in
async function saveCustomer({ email, name, optIn }) {
  if (!email || !optIn) return;
  await Customer.findOneAndUpdate(
    { email },
    { email, name, optIn, source: 'checkout' },
    { upsert: true, new: true }
  );
}

module.exports = saveCustomer;
