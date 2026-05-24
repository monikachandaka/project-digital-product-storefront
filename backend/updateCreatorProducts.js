const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const updateProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/monika');
    console.log('MongoDB connected');

    const products = await Product.find({});
    let updatedCount = 0;

    for (const product of products) {
      let updated = false;

      // Ensure every product has a YouTube video
      if (!product.youtubeUrl) {
        // 4K nature video as a nice looking placeholder
        product.youtubeUrl = 'https://www.youtube.com/watch?v=LXb3EKWsInQ';
        updated = true;
      }

      // Ensure every product has a downloadable file
      if (!product.fileUrl) {
        // Standard dummy PDF file
        product.fileUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
        updated = true;
      }
      
      // Ensure every product has an image
      if (!product.imageUrl && !product.image) {
          const sampleImage = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085';
          product.imageUrl = sampleImage;
          product.image = sampleImage;
          updated = true;
      }

      if (updated) {
        await product.save();
        updatedCount++;
      }
    }

    console.log(`Successfully updated ${updatedCount} products with placeholder images, videos, and files.`);
    process.exit();
  } catch (error) {
    console.error('Error updating data:', error);
    process.exit(1);
  }
};

updateProducts();
