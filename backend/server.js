// Load environment variables FIRST
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const discountRoutes = require('./routes/discountRoutes'); // Added line for discountRoutes
const currencyRoutes = require('./routes/currencyRoutes');
const taxRoutes = require('./routes/taxRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const affiliateRoutes = require('./routes/affiliateRoutes');

// Route imports
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const contactRoutes = require('./routes/contactRoutes');

// Connect to MongoDB
connectDB();

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: '🚀 DigitalVault API is running',
    version: '1.0.0',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', uptime: process.uptime() });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/discounts', discountRoutes); // Added line for discountRoutes
app.use('/api/currency', currencyRoutes);
app.use('/api/tax', taxRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/affiliates', affiliateRoutes);

app.get('/api/config/razorpay', (req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID });
});

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════════╗');
  console.log('║      🛒  DigitalVault API Server        ║');
  console.log('╠════════════════════════════════════════╣');
  console.log(`║  🌐  http://localhost:${PORT}              ║`);
  console.log(`║  🏗️   Environment: ${process.env.NODE_ENV}          ║`);
  console.log('╚════════════════════════════════════════╝');
  console.log('');
});
