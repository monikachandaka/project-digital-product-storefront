const express = require('express');
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  getMyOrders,
  getAllOrders,
  getDownloadLink,
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/:orderId/download/:productId', getDownloadLink);

router.use(protect);

router.post('/', createOrder);
router.post('/verify-payment', verifyPayment);
router.get('/my-orders', getMyOrders);
router.get('/admin/all', adminOnly, getAllOrders);

module.exports = router;
