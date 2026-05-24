const express = require('express');
const router = express.Router();
const discountController = require('../controllers/discountController');

const auth = require('../middleware/auth');
const creatorOnly = require('../middleware/creatorOnly');

// Creator routes

router.post('/create', auth.protect, creatorOnly, discountController.createDiscountCode);
router.get('/my-codes', auth.protect, creatorOnly, discountController.getCreatorDiscountCodes);

// Public route to apply a discount code
router.post('/apply', discountController.applyDiscountCode);

// Public route to get available discount codes
router.get('/available', discountController.getPublicDiscountCodes);

module.exports = router;
