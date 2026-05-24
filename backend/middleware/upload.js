const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Image storage
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'digitalvault/products',
    format: file.mimetype.split('/')[1] === 'jpeg' ? 'jpg' : file.mimetype.split('/')[1],
    transformation: [{ width: 800, height: 600, crop: 'limit', quality: 'auto' }],
    public_id: `product_${Date.now()}`,
  }),
});

// Digital file storage (raw)
const digitalFileStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'digitalvault/files',
    resource_type: 'raw',
    public_id: `file_${Date.now()}_${file.originalname}`,
  }),
});

// Decide storage based on field name
const dynamicStorage = {
  _handleFile(req, file, cb) {
    if (file.fieldname === 'image') {
      imageStorage._handleFile(req, file, cb);
    } else if (file.fieldname === 'file') {
      digitalFileStorage._handleFile(req, file, cb);
    } else {
      cb(new Error('Unknown field'));
    }
  },
  _removeFile(req, file, cb) {
    cb(null);
  },
};

const uploadProductFiles = multer({
  storage: dynamicStorage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'image') {
      if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Only image files allowed for product image'));
      }
    }
    cb(null, true);
  },
}).fields([
  { name: 'image', maxCount: 1 },
  { name: 'file', maxCount: 1 },
]);

module.exports = { uploadProductFiles };
