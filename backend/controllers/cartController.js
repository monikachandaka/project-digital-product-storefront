const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'title price image category');

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [], totalAmount: 0 });
  } else {
    // Auto-clean orphaned items (where product was deleted from DB)
    const originalLength = cart.items.length;
    cart.items = cart.items.filter((i) => i.product != null);
    
    if (cart.items.length !== originalLength) {
      cart.calculateTotal();
      await cart.save();
    }
  }

  res.json({ cart });
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId) return res.status(400).json({ message: 'Product ID is required' });

  // Prevent repurchasing the same product within 3 days
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
  const recentOrder = await Order.findOne({
    user: req.user._id,
    paymentStatus: 'paid',
    'items.product': productId,
    createdAt: { $gte: threeDaysAgo }
  });

  if (recentOrder) {
    return res.status(400).json({ message: 'You have already purchased this product within the last 3 days.' });
  }

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  if (product.stock < 1) return res.status(400).json({ message: 'Product is out of stock' });

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [{ product: productId, quantity: Number(quantity), price: product.price }],
      totalAmount: product.price * Number(quantity),
    });
  } else {
    const existingItem = cart.items.find((i) => i.product.toString() === productId);

    if (existingItem) {
      existingItem.quantity += Number(quantity);
    } else {
      cart.items.push({ product: productId, quantity: Number(quantity), price: product.price });
    }

    cart.calculateTotal();
    await cart.save();
  }

  await cart.populate('items.product', 'title price image category');
  res.json({ cart });
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
const updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  const { productId } = req.params;

  if (!quantity || quantity < 1) return res.status(400).json({ message: 'Quantity must be at least 1' });

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  const item = cart.items.find((i) => i.product.toString() === productId);
  if (!item) return res.status(404).json({ message: 'Item not in cart' });

  item.quantity = Number(quantity);
  cart.calculateTotal();
  await cart.save();
  await cart.populate('items.product', 'title price image category');

  res.json({ cart });
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = async (req, res) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  // Handle 'undefined' productId from frontend if product was orphaned
  if (productId === 'undefined') {
    await cart.populate('items.product', 'title');
    cart.items = cart.items.filter((i) => i.product != null);
  } else {
    cart.items = cart.items.filter((i) => i.product && i.product.toString() !== productId);
  }

  cart.calculateTotal();
  cart.markModified('items');
  await cart.save();
  await cart.populate('items.product', 'title price image category');

  res.json({ cart });
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.json({ message: 'Cart already empty' });

  cart.items = [];
  cart.totalAmount = 0;
  await cart.save();

  res.json({ message: 'Cart cleared', cart });
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
