const Affiliate = require('../models/Affiliate');
const AffiliateSale = require('../models/AffiliateSale');

// Call this after order is paid, if ?ref=code was present
async function trackAffiliate(order, ref) {
  if (!ref) return;
  const affiliate = await Affiliate.findOne({ code: ref });
  if (!affiliate) return;
  // Calculate commission
  const commission = order.totalAmount * affiliate.commissionRate;
  await AffiliateSale.create({ affiliate: affiliate._id, order: order._id, commission });
  affiliate.totalSales += 1;
  affiliate.totalCommission += commission;
  await affiliate.save();
}

module.exports = trackAffiliate;
