const express = require('express');
const router = express.Router();
const { 
  getAnalytics, 
  getCreators, 
  getBuyers, 
  getProducts, 
  getOrders,
  updateUserStatus,
  updateProductStatus,
  getCategories,
  getAllReviews,
  getNotifications,
  deleteProduct,
  getCoupons,
  createCoupon,
  deleteCoupon
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);

router.get('/analytics', getAnalytics);
router.get('/creators', getCreators);
router.get('/buyers', getBuyers);
router.get('/products', getProducts);
router.get('/orders', getOrders);
router.get('/categories', getCategories);
router.get('/reviews', getAllReviews);
router.get('/notifications', getNotifications);

router.put('/users/:id/status', updateUserStatus);
router.put('/products/:id/status', updateProductStatus);
router.delete('/products/:id', deleteProduct);

// Coupon routes
router.get('/coupons', getCoupons);
router.post('/coupons', createCoupon);
router.delete('/coupons/:id', deleteCoupon);

module.exports = router;
