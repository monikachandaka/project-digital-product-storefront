const trackAffiliate = require('../utils/trackAffiliate');
const syncMailchimp = require('../utils/syncMailchimp');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const sendEmail = require('../utils/sendEmail');
const stampPdf = require('../utils/pdfStamp');
const path = require('path');
const fs = require('fs');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const saveCustomer = require('../utils/saveCustomer');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay order and save pending order to DB
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  const { items, totalAmount, optIn } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'No items in order' });
  }

  // Prevent repurchasing any product within 3 days
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
  const productIds = items.map(item => item.product);
  const recentOrder = await Order.findOne({
    user: req.user._id,
    paymentStatus: 'paid',
    'items.product': { $in: productIds },
    createdAt: { $gte: threeDaysAgo }
  });

  if (recentOrder) {
    return res.status(400).json({ message: 'You have already purchased one or more of these products within the last 3 days.' });
  }

  // Validate products and build order items
  const orderItems = [];
  let calculatedTotal = 0;

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) return res.status(404).json({ message: `Product not found: ${item.product}` });

    orderItems.push({
      product: product._id,
      quantity: item.quantity || 1,
      price: product.price,
    });
    calculatedTotal += product.price * (item.quantity || 1);
  }

  // Use frontend calculated total if provided, otherwise fallback
  const grandTotal = totalAmount ? Math.round(totalAmount) : Math.round(calculatedTotal + (calculatedTotal * 0.18));

  // Create Razorpay order (amount in paise)
  const razorpayOrder = await razorpay.orders.create({
    amount: grandTotal * 100,
    currency: 'INR',
    receipt: `order_${Date.now()}`,
  });


  // Save customer if opted in
  await saveCustomer({ email: req.user.email, name: req.user.name, optIn });
  if (optIn) await syncMailchimp({ email: req.user.email, name: req.user.name });

  // Save order in DB as pending
  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    totalAmount: grandTotal,
    paymentStatus: 'pending',
    razorpayOrderId: razorpayOrder.id,
  });

  res.status(201).json({
    order,
    razorpayOrder,
  });
};

// @desc    Verify Razorpay payment signature and mark order paid
// @route   POST /api/orders/verify-payment
// @access  Private
const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
    return res.status(400).json({ message: 'Missing payment verification fields' });
  }

  // Verify signature
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    await Order.findByIdAndUpdate(orderId, { paymentStatus: 'failed' });
    return res.status(400).json({ message: 'Payment verification failed: invalid signature' });
  }

  // Update order as paid
  let order = await Order.findByIdAndUpdate(
    orderId,
    {
      paymentStatus: 'paid',
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    },
    { new: true }
  ).populate('items.product', 'title price image fileUrl');

  if (!order) return res.status(404).json({ message: 'Order not found' });

  // Track affiliate commission if ref code present (from session/cookie/header)
  const ref = req.headers['x-affiliate-ref'] || req.cookies?.ref || null;
  await trackAffiliate(order, ref);

  // Generate expiring download links (24h, 3 downloads)
  const now = new Date();
  const links = await Promise.all(order.items.map(async (item) => {
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    // Generate a unique token for the download link
    const token = crypto.randomBytes(24).toString('hex');
    // Save the link as /api/orders/:orderId/download/:productId?token=...
    return {
      product: item.product._id,
      url: `/api/orders/${order._id}/download/${item.product._id}?token=${token}`,
      expiresAt,
      downloadCount: 0,
      maxDownloads: 3,
      ipLogs: [],
      token,
    };
  }));
  order.downloadLinks = links;
  await order.save();

  // Email receipt with download links
  const userEmail = req.user.email;
  let html = `<h2>Thank you for your purchase!</h2><ul>`;
  for (const link of links) {
    const prod = order.items.find(i => i.product._id.toString() === link.product.toString());
    const frontendUrl = link.url.replace('/api', '');
    html += `<li><b>${prod.product.title}</b>: <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}${frontendUrl}">Download Link</a> (expires in 24h or 3 downloads)</li>`;
  }
  html += '</ul>';
  
  try {
    await sendEmail({
      to: userEmail,
      subject: 'Your DigitalVault Receipt & Download Links',
      html,
    });
  } catch (error) {
    console.error('Failed to send receipt email, but payment was successful:', error.message);
  }

  res.json({ message: 'Payment verified successfully', order });
};

// @desc    Get logged-in user's orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate('items.product', 'title price image category fileUrl')
    .sort({ createdAt: -1 });

  res.json({ orders });
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  const orders = await Order.find({})
    .populate('user', 'name email')
    .populate('items.product', 'title price image')
    .sort({ createdAt: -1 });

  res.json({ orders });
};

// @desc    Get download link for purchased product
// @route   GET /api/orders/:orderId/download/:productId
// @access  Private OR Public with valid Token
const getDownloadLink = async (req, res) => {
  const { orderId, productId } = req.params;
  const { token } = req.query;
  const order = await Order.findById(orderId).populate('user');
  if (!order) return res.status(404).json({ message: 'Order not found' });

  let authorized = false;
  let activeLink = null;

  if (token) {
    activeLink = order.downloadLinks.find(l => l.product.toString() === productId && l.token === token);
    if (activeLink) authorized = true;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const jwtToken = req.headers.authorization.split(' ')[1];
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
      if (order.user._id.toString() === decoded.id) {
        authorized = true;
        activeLink = order.downloadLinks.find(l => l.product.toString() === productId);
      }
    } catch (e) {
      // Invalid JWT, authorized remains false
      console.error('JWT Verification failed:', e.message);
    }
  }

  if (!authorized) return res.status(403).json({ message: 'Access denied: Invalid token or not logged in' });
  if (order.paymentStatus !== 'paid') return res.status(403).json({ message: 'Payment not completed for this order' });
  if (!activeLink) return res.status(404).json({ message: 'Download link not available' });

  if (activeLink.expiresAt < new Date()) return res.status(403).json({ message: 'Download link expired' });
  if (activeLink.downloadCount >= activeLink.maxDownloads) return res.status(403).json({ message: 'Download limit reached' });

  // IP logging
  const ip = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'unknown';
  activeLink.ipLogs.push({ ip, date: new Date() });
  activeLink.downloadCount += 1;
  await order.save();

  // Find product
  const product = await Product.findById(productId);
  if (!product || !product.fileUrl) {
    return res.status(404).json({ message: 'Download file not available for this product' });
  }

  // Generate signed API URL if stored on Cloudinary
  let finalDownloadUrl = product.fileUrl;
  if (product.filePublicId && product.fileUrl.includes('cloudinary')) {
    const cloudinary = require('cloudinary').v2;
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    // Use the secure API download endpoint to bypass raw strict delivery ACLs
    finalDownloadUrl = cloudinary.utils.private_download_url(
      product.filePublicId, 
      '', 
      { resource_type: 'raw', type: 'upload' }
    );
    console.log('Generated Cloudinary URL:', finalDownloadUrl);
  }

  // PDF stamping if it is a PDF file
  if (product.fileUrl.endsWith('.pdf')) {
    try {
      let pdfBuffer;
      if (finalDownloadUrl.startsWith('http')) {
        const response = await fetch(finalDownloadUrl);
        if (!response.ok) {
           const errText = await response.text();
           throw new Error(`Failed to fetch PDF from storage: ${response.status} ${errText}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        pdfBuffer = Buffer.from(arrayBuffer);
      } else {
        const fs = require('fs');
        const path = require('path');
        pdfBuffer = fs.readFileSync(path.join(__dirname, '../..', finalDownloadUrl));
      }
      const stampPdf = require('../utils/pdfStamp');
      const userEmail = order.user.email || 'customer';
      const stamped = await stampPdf(pdfBuffer, userEmail);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${product.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-stamped.pdf"`);
      return res.send(Buffer.from(stamped));
    } catch (error) {
      console.error('PDF Download Error:', error);
      return res.status(500).json({ message: 'Error generating PDF download: ' + error.message });
    }
  } else {
    // Stream non-PDF files to avoid CORS issues with frontend Blob requests
    try {
      let buffer;
      let contentType = 'application/octet-stream';
      if (finalDownloadUrl.startsWith('http')) {
        const response = await fetch(finalDownloadUrl);
        if (!response.ok) throw new Error(`Failed to fetch file from storage: ${response.status}`);
        const arrayBuffer = await response.arrayBuffer();
        buffer = Buffer.from(arrayBuffer);
        contentType = response.headers.get('content-type') || contentType;
      } else {
         const fs = require('fs');
         const path = require('path');
         buffer = fs.readFileSync(path.join(__dirname, '../..', finalDownloadUrl));
      }

      if (product.fileUrl.endsWith('.txt')) {
         const userEmail = order.user.email || 'customer';
         const watermark = `\n\n----------------------------------------\nSecurely Licensed to: ${userEmail}\nDigitalVault Verified Purchase\n----------------------------------------\n`;
         buffer = Buffer.concat([buffer, Buffer.from(watermark, 'utf8')]);
         contentType = 'text/plain';
      }

      res.setHeader('Content-Type', contentType);
      const ext = product.fileUrl.split('.').pop() || 'file';
      res.setHeader('Content-Disposition', `attachment; filename="${product.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-stamped.${ext}"`);
      return res.send(buffer);
    } catch (error) {
      console.error('File Download Error:', error);
      return res.status(500).json({ message: 'Error downloading file: ' + error.message });
    }
  }
};

module.exports = { createOrder, verifyPayment, getMyOrders, getAllOrders, getDownloadLink };
