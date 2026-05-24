const Product = require('../models/Product');
const cloudinary = require('cloudinary').v2;
const asyncHandler = require('express-async-handler');

// Suggest related products for cross-selling
const getRelatedProducts = async (req, res) => {
  try {
    const { productId } = req.query;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    // Find related products by category, exclude the current product
    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id }
    }).limit(6);
    res.json(related);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all products with search, filter, sort, pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const {
      search, category, minPrice, maxPrice, rating,
      sort = '-createdAt', page = 1, limit = 12, creator
    } = req.query;

    const query = {};
    if (creator) query.createdBy = creator;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (rating) query.averageRating = { $gte: Number(rating) };

    const sortOptions = {
      '-createdAt': { createdAt: -1 },
      'createdAt': { createdAt: 1 },
      'price': { price: 1 },
      '-price': { price: -1 },
      '-averageRating': { averageRating: -1 },
      '-numReviews': { numReviews: -1 },
    };
    const sortQuery = sortOptions[sort] || { createdAt: -1 };

    const pageNum = Math.max(Number(page), 1);
    const limitNum = Math.min(Number(limit), 50);
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query).sort(sortQuery).skip(skip).limit(limitNum).select('-reviews'),
      Product.countDocuments(query),
    ]);

    res.json({
      products,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('reviews.user', 'name avatar')
    .populate('createdBy', 'name avatar role');
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ product });
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Creator
const createProduct = asyncHandler(async (req, res) => {
  const { title, description, price, category, tags, imageUrl, youtubeUrl } = req.body;
  if (!title || !description || !price || !category) {
    return res.status(400).json({ message: 'Title, description, price, and category are required' });
  }

  let tagArray = [];
  if (tags) {
    tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);
  }

  const productData = {
    title,
    description,
    price,
    category,
    tags: tagArray,
    imageUrl: imageUrl || '',
    youtubeUrl: youtubeUrl || '',
    createdBy: req.user._id,
  };

  if (req.files) {
    if (req.files.image && req.files.image[0]) {
      productData.image = req.files.image[0].path;
      productData.imagePublicId = req.files.image[0].filename;
    }
    if (req.files.file && req.files.file[0]) {
      productData.fileUrl = req.files.file[0].path;
      productData.filePublicId = req.files.file[0].filename;
    }
  }

  const product = new Product(productData);
  await product.save();
  res.status(201).json(product);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Creator
const updateProduct = asyncHandler(async (req, res) => {
  const { title, description, price, category, tags, imageUrl, youtubeUrl } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  
  if (title) product.title = title;
  if (description) product.description = description;
  if (price) product.price = price;
  if (category) product.category = category;
  if (imageUrl !== undefined) product.imageUrl = imageUrl;
  if (youtubeUrl !== undefined) product.youtubeUrl = youtubeUrl;
  
  if (tags) {
    product.tags = tags.split(',').map(t => t.trim()).filter(Boolean);
  }

  if (req.files) {
    if (req.files.image && req.files.image[0]) {
      product.image = req.files.image[0].path;
      product.imagePublicId = req.files.image[0].filename;
    }
    if (req.files.file && req.files.file[0]) {
      product.fileUrl = req.files.file[0].path;
      product.filePublicId = req.files.file[0].filename;
    }
  }

  await product.save();
  res.json(product);
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Creator
const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  if (product.filePublicId) {
    await cloudinary.uploader.destroy(product.filePublicId, { resource_type: 'raw' }).catch(() => {});
  }
  await product.deleteOne();
  res.json({ message: 'Product deleted successfully' });
};

// @desc    Add/update review on a product
// @route   POST /api/products/:id/reviews
// @access  Private
const addReview = async (req, res) => {
  const { rating, comment } = req.body;
  if (!rating || !comment) {
    return res.status(400).json({ message: 'Rating and comment are required' });
  }
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  // Check if user already reviewed
  const existingReview = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );
  if (existingReview) {
    existingReview.rating = Number(rating);
    existingReview.comment = comment;
  } else {
    product.reviews.push({ user: req.user._id, rating: Number(rating), comment });
  }
  product.calculateAverageRating();
  await product.save();
  // Populate user names for response
  await product.populate('reviews.user', 'name');
  res.status(201).json({ message: 'Review submitted successfully', product });
};

// @desc    Get top reviews across all products
// @route   GET /api/products/top-reviews
// @access  Public
const getTopReviews = async (req, res) => {
  try {
    // Find products that have reviews with rating 4 or 5
    const productsWithReviews = await Product.find({ 'reviews.rating': { $gte: 4 } })
      .populate('reviews.user', 'name avatar role')
      .lean();

    let allTopReviews = [];
    
    // Extract reviews, attach product info for context
    productsWithReviews.forEach(product => {
      product.reviews.forEach(review => {
        if (review.rating >= 4 && review.user) {
          allTopReviews.push({
            _id: review._id,
            rating: review.rating,
            comment: review.comment,
            createdAt: review.createdAt,
            user: {
              name: review.user.name,
              avatar: review.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user.name)}&background=8b5cf6&color=fff`,
              role: review.user.role === 'creator' ? 'Creator' : 'Buyer'
            },
            product: {
              _id: product._id,
              title: product.title
            }
          });
        }
      });
    });

    // Sort by newest first
    allTopReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Limit to top 3 for the homepage
    res.json(allTopReviews.slice(0, 3));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching top reviews' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
  getRelatedProducts,
  getTopReviews,
};
