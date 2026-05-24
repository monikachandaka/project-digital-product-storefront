const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  forgotPassword,
  resetPassword,
  adminLogin,
  getTopCreators
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const asyncHandler = require('express-async-handler');

router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));
router.post('/admin-login', asyncHandler(adminLogin));
router.get('/creators/top', asyncHandler(getTopCreators));
router.get('/me', protect, asyncHandler(getMe));
router.put('/profile', protect, asyncHandler(updateProfile));
router.post('/forgot-password', asyncHandler(forgotPassword));
router.post('/reset-password/:token', asyncHandler(resetPassword));

module.exports = router;
