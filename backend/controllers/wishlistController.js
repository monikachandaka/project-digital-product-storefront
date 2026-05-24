const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
    'products',
    'title price image category averageRating numReviews'
  );

  if (!wishlist) {
    wishlist = { products: [] };
  }

  res.json({ wishlist: wishlist.products });
};

// @desc    Toggle product in wishlist (add or remove)
// @route   POST /api/wishlist/:productId
// @access  Private
const toggleWishlist = async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, products: [productId] });
  } else {
    const index = wishlist.products.indexOf(productId);
    if (index === -1) {
      wishlist.products.push(productId);
    } else {
      wishlist.products.splice(index, 1);
    }
    await wishlist.save();
  }

  await wishlist.populate('products', 'title price image category averageRating numReviews');
  res.json({ wishlist: wishlist.products });
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
const removeFromWishlist = async (req, res) => {
  const { productId } = req.params;

  const wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });

  wishlist.products = wishlist.products.filter((p) => p.toString() !== productId);
  await wishlist.save();
  await wishlist.populate('products', 'title price image category averageRating numReviews');

  res.json({ wishlist: wishlist.products });
};

module.exports = { getWishlist, toggleWishlist, removeFromWishlist };
