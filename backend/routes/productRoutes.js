const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
  getTopReviews,
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');
const creatorOnly = require('../middleware/creatorOnly');
const { uploadProductFiles } = require('../middleware/upload');

const asyncHandler = require('express-async-handler');

// Public routes
router.get('/', asyncHandler(getProducts));
router.get('/top-reviews', asyncHandler(getTopReviews));
router.get('/related', asyncHandler(require('../controllers/productController').getRelatedProducts));
router.get('/:id', asyncHandler(getProductById));

// Private routes
router.post('/:id/reviews', protect, asyncHandler(addReview));

// Creator routes
router.post('/', protect, creatorOnly, uploadProductFiles, createProduct); // createProduct is already wrapped in controller
router.put('/:id', protect, creatorOnly, uploadProductFiles, updateProduct); // updateProduct is already wrapped in controller
router.delete('/:id', protect, creatorOnly, asyncHandler(deleteProduct));

module.exports = router;
