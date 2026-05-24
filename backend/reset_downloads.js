const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const Order = require('./models/Order');
  
  const orders = await Order.find({});
  for (const order of orders) {
    if (order.downloadLinks && order.downloadLinks.length > 0) {
      for (const link of order.downloadLinks) {
        link.downloadCount = 0;
      }
      await order.save();
    }
  }
  
  console.log('Reset download counts to 0 for all orders.');
  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});
