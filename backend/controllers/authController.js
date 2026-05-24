const crypto = require('crypto');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide name, email and password' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists with this email' });
  }

  // Only allow 'buyer' or 'creator' for self-registration
  const userRole = ['buyer', 'creator'].includes(role) ? role : 'buyer';

  const user = await User.create({ name, email, password, role: userRole });
  const token = generateToken(user._id);

  res.status(201).json({
    message: 'Registration successful',
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = generateToken(user._id);

  res.json({
    message: 'Login successful',
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
};

// @desc    Get logged-in user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt,
    },
  });
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('+password');

  const { name, email, currentPassword, newPassword, avatar, banner, bio, socialLinks } = req.body;

  if (name) user.name = name;
  if (email) user.email = email;
  if (avatar) user.avatar = avatar;
  if (banner) user.banner = banner;
  if (bio) user.bio = bio;
  if (Array.isArray(socialLinks)) user.socialLinks = socialLinks;

  if (newPassword) {
    if (!currentPassword) {
      return res.status(400).json({ message: 'Please provide your current password' });
    }
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    user.password = newPassword;
  }

  await user.save();

  res.json({
    message: 'Profile updated successfully',
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      banner: user.banner,
      bio: user.bio,
      socialLinks: user.socialLinks,
      createdAt: user.createdAt,
    },
  });
};

// @desc    Forgot password - send reset email
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const user = await User.findOne({ email });
  if (!user) {
    // Don't reveal if email exists
    return res.json({ message: 'If this email is registered, you will receive a reset link shortly' });
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const html = `
    <div style="font-family: DM Sans, sans-serif; max-width: 500px; margin: auto; padding: 32px; background: #fafaf9; border-radius: 12px;">
      <h2 style="color: #f97316; font-family: 'Playfair Display', serif;">DigitalVault</h2>
      <h3 style="color: #1c1917;">Reset Your Password</h3>
      <p style="color: #57534e;">You requested a password reset. Click the button below to set a new password. This link expires in <strong>15 minutes</strong>.</p>
      <a href="${resetUrl}" style="display: inline-block; background: #f97316; color: #fff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0;">Reset Password</a>
      <p style="color: #78716c; font-size: 12px;">If you did not request this, please ignore this email. Your account remains secure.</p>
      <p style="color: #a8a29e; font-size: 11px;">Or copy this link: ${resetUrl}</p>
    </div>
  `;

  try {
    await sendEmail({ to: user.email, subject: 'DigitalVault — Password Reset Request', html });
    res.json({ message: 'Password reset email sent successfully' });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(500).json({ message: 'Email could not be sent. Please try again.' });
  }
};

// @desc    Reset password with token
// @route   POST /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res) => {
  const { password } = req.body;
  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: 'Reset token is invalid or has expired' });
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.json({ message: 'Password reset successfully. Please login with your new password.' });
};

// @desc    Admin login
// @route   POST /api/auth/admin-login
// @access  Public
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  // Strict hardcoded check
  if (email !== 'monikachandaka24@gmail.com' || password !== '123456') {
    return res.status(401).json({ message: 'Invalid admin credentials' });
  }

  try {
    // Check if the email already exists in the database
    let adminUser = await User.findOne({ email: 'monikachandaka24@gmail.com' });
    
    if (!adminUser) {
      // Create it if it doesn't exist at all
      adminUser = await User.create({
        name: 'System Admin',
        email: 'monikachandaka24@gmail.com',
        password: '123456',
        role: 'admin'
      });
    } else if (adminUser.role !== 'admin') {
      // If the user registered earlier as a buyer/creator, upgrade them to admin
      adminUser.role = 'admin';
      await adminUser.save();
    }

    const token = generateToken(adminUser._id);

    res.json({
      message: 'Admin login successful',
      token,
      user: {
        _id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
        createdAt: adminUser.createdAt,
      },
    });
  } catch (error) {
    console.error('Admin Login Error:', error);
    res.status(500).json({ message: 'Internal server error during admin login' });
  }
};

// @desc    Get Top Creators
// @route   GET /api/auth/creators/top
// @access  Public
const getTopCreators = async (req, res) => {
  try {
    const creators = await User.find({ role: 'creator' })
      .select('name avatar bio')
      .limit(4)
      .lean();
    
    const Product = require('../models/Product');
    const Order = require('../models/Order');

    const formattedCreators = [];
    for (const c of creators) {
      const products = await Product.find({ createdBy: c._id }).select('_id');
      const productIds = products.map(p => p._id);

      const salesAgg = await Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $unwind: '$items' },
        { $match: { 'items.product': { $in: productIds } } },
        { $group: { _id: null, totalSales: { $sum: '$items.quantity' } } }
      ]);

      const actualSales = salesAgg.length > 0 ? salesAgg[0].totalSales : 0;

      formattedCreators.push({
        ...c,
        sales: `${actualSales} Sales`,
        tags: ["Digital", "Creator"]
      });
    }

    res.json(formattedCreators);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching top creators' });
  }
};

module.exports = { register, login, getMe, updateProfile, forgotPassword, resetPassword, adminLogin, getTopCreators };
