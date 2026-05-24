# DigitalVault — Backend API

## Quick Start

```bash
cd backend
npm install
# Fill in your credentials in .env
node server.js
```

## Folder Structure

```
backend/
├── server.js              ← Entry point (node server.js)
├── .env                   ← All secrets/config
├── package.json
├── config/
│   ├── db.js              ← MongoDB connection
│   └── cloudinary.js      ← Cloudinary setup
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Cart.js
│   ├── Wishlist.js
│   ├── Order.js
│   └── Contact.js
├── controllers/
│   ├── authController.js
│   ├── productController.js
│   ├── cartController.js
│   ├── wishlistController.js
│   ├── orderController.js
│   ├── adminController.js
│   └── contactController.js
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── cartRoutes.js
│   ├── wishlistRoutes.js
│   ├── orderRoutes.js
│   ├── adminRoutes.js
│   └── contactRoutes.js
├── middleware/
│   ├── auth.js            ← JWT protect + adminOnly
│   ├── upload.js          ← Multer + Cloudinary
│   └── errorHandler.js
└── utils/
    ├── generateToken.js
    └── sendEmail.js
```

## .env Setup

Fill in your `.env` file:

| Variable | Where to get it |
|---|---|
| `MONGO_URI` | MongoDB Atlas → Connect → Drivers |
| `JWT_SECRET` | Any random 32+ char string |
| `CLOUDINARY_*` | cloudinary.com → Dashboard |
| `RAZORPAY_KEY_ID/SECRET` | razorpay.com → Settings → API Keys |
| `EMAIL_USER/PASS` | Gmail → App Passwords |

## API Endpoints

### Auth
| Method | URL | Access |
|---|---|---|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/auth/me | Private |
| PUT | /api/auth/profile | Private |
| POST | /api/auth/forgot-password | Public |
| POST | /api/auth/reset-password/:token | Public |

### Products
| Method | URL | Access |
|---|---|---|
| GET | /api/products | Public |
| GET | /api/products/:id | Public |
| POST | /api/products | Admin |
| PUT | /api/products/:id | Admin |
| DELETE | /api/products/:id | Admin |
| POST | /api/products/:id/reviews | Private |

### Cart / Wishlist / Orders
All protected. See routes/ folder for full list.
