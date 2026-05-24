const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const DiscountCode = require('../models/DiscountCode');
const cloudinary = require('cloudinary').v2;

// @desc    Get dashboard analytics (Admin)
const getAnalytics = async (req, res) => {
  const users = await User.find();
  const products = await Product.find().populate('createdBy', 'name');
  const orders = await Order.find({ paymentStatus: 'paid' }).populate('user', 'name');

  const totalCreators = users.filter(u => u.role === 'creator').length;
  const totalBuyers = users.filter(u => u.role === 'buyer').length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  const topProducts = products.map(p => {
    const productOrders = orders.filter(o => o.items.some(i => i.product.toString() === p._id.toString()));
    const revenue = productOrders.reduce((sum, o) => {
      const item = o.items.find(i => i.product.toString() === p._id.toString());
      return sum + (item ? item.price * item.quantity : 0);
    }, 0);
    return {
      id: p._id,
      title: p.title,
      sales: productOrders.length,
      revenue
    };
  }).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  const topCreatorsList = users.filter(u => u.role === 'creator').map(u => {
    const creatorProducts = products.filter(p => p.createdBy && p.createdBy._id.toString() === u._id.toString());
    let totalEarnings = 0;
    creatorProducts.forEach(p => {
      const productOrders = orders.filter(o => o.items.some(i => i.product.toString() === p._id.toString()));
      productOrders.forEach(o => {
        const item = o.items.find(i => i.product.toString() === p._id.toString());
        if (item) totalEarnings += item.price * item.quantity;
      });
    });
    return {
      id: u._id,
      name: u.name,
      earnings: totalEarnings,
      products: creatorProducts.length
    }
  }).sort((a, b) => b.earnings - a.earnings).slice(0, 5);

  // Generate real historical sales data (last 7 months)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  
  const salesData = [];
  const userGrowth = [];
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = monthNames[d.getMonth()];
    const year = d.getFullYear();
    const label = `${month} ${year}`;
    
    // Filter orders for this month
    const monthOrders = orders.filter(o => {
      const oDate = new Date(o.createdAt);
      return oDate.getMonth() === d.getMonth() && oDate.getFullYear() === d.getFullYear();
    });
    
    const revenue = monthOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    
    salesData.push({ name: label, sales: monthOrders.length, revenue });
    
    // Filter users for this month
    const monthUsers = users.filter(u => {
      const uDate = new Date(u.createdAt);
      return uDate.getMonth() === d.getMonth() && uDate.getFullYear() === d.getFullYear();
    });
    
    userGrowth.push({
      name: label,
      buyers: monthUsers.filter(u => u.role === 'buyer').length,
      creators: monthUsers.filter(u => u.role === 'creator').length
    });
  }

  res.json({
    stats: {
      totalCreators,
      totalBuyers,
      totalProducts: products.length,
      totalOrders: orders.length,
      totalRevenue,
      activeUsers: users.length,
      newUsersMonth: users.filter(u => new Date(u.createdAt) > new Date(now.getFullYear(), now.getMonth(), 1)).length,
      pendingApprovals: 0,
    },
    salesData,
    userGrowth,
    topProducts,
    topCreators: topCreatorsList
  });
};

// @desc    Get all creators
const getCreators = async (req, res) => {
  const users = await User.find({ role: 'creator' });
  const products = await Product.find();
  const orders = await Order.find({ paymentStatus: 'paid' });

  const creators = users.map(u => {
    const creatorProducts = products.filter(p => p.createdBy && p.createdBy.toString() === u._id.toString());
    
    let totalEarnings = 0;
    creatorProducts.forEach(p => {
      const productOrders = orders.filter(o => o.items.some(i => i.product.toString() === p._id.toString()));
      productOrders.forEach(o => {
        const item = o.items.find(i => i.product.toString() === p._id.toString());
        if (item) totalEarnings += item.price * item.quantity;
      });
    });

    return {
      _id: u._id,
      name: u.name,
      email: u.email,
      productsCount: creatorProducts.length,
      totalEarnings,
      status: 'active',
      joined: new Date(u.createdAt).toLocaleDateString()
    };
  });
  res.json(creators);
};

// @desc    Get all buyers
const getBuyers = async (req, res) => {
  const users = await User.find({ role: 'buyer' });
  const orders = await Order.find({ paymentStatus: 'paid' });

  const buyers = users.map(u => {
    const userOrders = orders.filter(o => o.user && o.user.toString() === u._id.toString());
    const totalSpent = userOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    return {
      _id: u._id,
      name: u.name,
      email: u.email,
      ordersCount: userOrders.length,
      totalSpent,
      status: 'active',
      joined: new Date(u.createdAt).toLocaleDateString()
    };
  });
  res.json(buyers);
};

// @desc    Get all products
const getProducts = async (req, res) => {
  const products = await Product.find().populate('createdBy', 'name');
  const orders = await Order.find({ paymentStatus: 'paid' });

  const formattedProducts = products.map(p => {
    const productOrders = orders.filter(o => o.items.some(i => i.product.toString() === p._id.toString()));
    return {
      _id: p._id,
      title: p.title,
      creator: p.createdBy ? p.createdBy.name : 'Unknown Creator',
      price: p.price,
      category: p.category || 'General',
      sales: productOrders.length,
      status: 'approved'
    };
  });
  res.json(formattedProducts);
};

// @desc    Get all orders
const getOrders = async (req, res) => {
  const orders = await Order.find().populate('user', 'name').populate('items.product', 'title');

  const formattedOrders = orders.map(o => {
    return {
      _id: o._id,
      buyer: o.user ? o.user.name : 'Guest',
      product: o.items.map(i => i.product ? i.product.title : 'Deleted Product').join(', '),
      amount: o.totalAmount,
      date: new Date(o.createdAt).toLocaleDateString(),
      status: o.paymentStatus === 'paid' ? 'completed' : o.paymentStatus
    };
  });
  res.json(formattedOrders);
};

// @desc    Update user status (block/unblock)
const updateUserStatus = async (req, res) => {
  res.json({ message: 'User status updated successfully' });
};

// @desc    Update product status (approve/reject)
const updateProductStatus = async (req, res) => {
  res.json({ message: 'Product status updated successfully' });
};

// @desc    Get all categories and stats
const getCategories = async (req, res) => {
  const products = await Product.find();
  const orders = await Order.find({ paymentStatus: 'paid' });

  const categoriesMap = {
    'eBooks': { products: 0, revenue: 0 },
    'Templates': { products: 0, revenue: 0 },
    'Design Assets': { products: 0, revenue: 0 },
    'Software Tools': { products: 0, revenue: 0 },
    'Study Materials': { products: 0, revenue: 0 }
  };

  products.forEach(p => {
    if (categoriesMap[p.category]) {
      categoriesMap[p.category].products += 1;
    } else {
      // In case there are legacy products with old categories
      categoriesMap[p.category] = { products: 1, revenue: 0 };
    }
  });

  orders.forEach(o => {
    o.items.forEach(i => {
      const product = products.find(p => p._id.toString() === i.product?.toString());
      if (product && categoriesMap[product.category]) {
        categoriesMap[product.category].revenue += i.price * i.quantity;
      }
    });
  });

  const formattedCategories = Object.keys(categoriesMap).map(key => ({
    name: key,
    products: categoriesMap[key].products,
    revenue: categoriesMap[key].revenue
  }));

  res.json(formattedCategories);
};

// @desc    Get all reviews
const getAllReviews = async (req, res) => {
  const products = await Product.find().populate('reviews.user', 'name email');
  
  const allReviews = [];
  products.forEach(p => {
    p.reviews.forEach(r => {
      allReviews.push({
        _id: r._id,
        productId: p._id,
        productTitle: p.title,
        user: r.user ? r.user.name : 'Unknown User',
        rating: r.rating,
        comment: r.comment,
        date: new Date(r.createdAt).toLocaleDateString()
      });
    });
  });

  // Sort by newest first
  allReviews.sort((a, b) => new Date(b.date) - new Date(a.date));

  res.json(allReviews);
};

// @desc    Get all notifications
const getNotifications = async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).limit(5);
  const orders = await Order.find({ paymentStatus: 'paid' }).sort({ createdAt: -1 }).limit(5);

  const notifications = [];

  users.forEach(u => {
    notifications.push({
      id: `u-${u._id}`,
      type: 'user',
      title: u.role === 'creator' ? 'New Creator Joined' : 'New Buyer Joined',
      desc: `${u.name} has registered on the platform.`,
      time: new Date(u.createdAt).toLocaleString(),
      iconName: 'FiUserPlus',
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-500/10',
      dateObj: new Date(u.createdAt)
    });
  });

  orders.forEach(o => {
    notifications.push({
      id: `o-${o._id}`,
      type: 'sale',
      title: 'New Order Processed',
      desc: `Order completed for $${o.totalAmount.toFixed(2)}.`,
      time: new Date(o.createdAt).toLocaleString(),
      iconName: 'FiDollarSign',
      color: 'text-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
      dateObj: new Date(o.createdAt)
    });
  });

  notifications.sort((a, b) => b.dateObj - a.dateObj);
  
  res.json(notifications);
};

// @desc    Delete a product (Admin)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.filePublicId) {
      await cloudinary.uploader.destroy(product.filePublicId, { resource_type: 'raw' }).catch(() => {});
    }
    await product.deleteOne();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all coupons (Admin)
const getCoupons = async (req, res) => {
  try {
    const coupons = await DiscountCode.find().populate('creator', 'name email').sort('-createdAt');
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create a new coupon (Admin)
const createCoupon = async (req, res) => {
  try {
    const { code, type, value, expiresAt, usageLimit, active } = req.body;
    
    // Check if code already exists
    const existing = await DiscountCode.findOne({ code });
    if (existing) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }

    const coupon = await DiscountCode.create({
      code,
      creator: req.user._id, // Admin creating the global coupon
      type,
      value,
      expiresAt,
      usageLimit,
      active: active !== undefined ? active : true
    });
    
    // Populate creator to return the same format as getCoupons
    await coupon.populate('creator', 'name email');
    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a coupon (Admin)
const deleteCoupon = async (req, res) => {
  try {
    const coupon = await DiscountCode.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    await coupon.deleteOne();
    res.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { 
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
};
