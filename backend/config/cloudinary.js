const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for product images
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'digitalvault/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 800, height: 600, crop: 'limit' }],
  },
});

// Storage for digital files (PDF, ZIP, etc.)
const fileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'digitalvault/files',
    resource_type: 'raw',
    allowed_formats: ['pdf', 'zip', 'rar', 'docx', 'xlsx', 'pptx', 'mp4', 'mp3'],
  },
});

const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

const uploadFile = multer({
  storage: fileStorage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});

// Upload both image and digital file
const uploadProductFiles = multer({
  storage: imageStorage,
  limits: { fileSize: 100 * 1024 * 1024 },
}).fields([
  { name: 'image', maxCount: 1 },
  { name: 'file', maxCount: 1 },
]);

module.exports = { cloudinary, uploadImage, uploadFile, uploadProductFiles };
