const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const categories = ['eBooks', 'Templates', 'Design Assets', 'Software Tools', 'Study Materials'];

const generateProducts = () => {
  const products = [];
  
  const images = {
    'eBooks': [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f',
      'https://images.unsplash.com/photo-1589829085413-56de8ae18c73',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794',
      'https://images.unsplash.com/photo-1532012197267-da84d127e765',
      'https://images.unsplash.com/photo-1524578971842-1718017d8487'
    ],
    'Templates': [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d',
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8',
      'https://images.unsplash.com/photo-1481481312836-8db71d375bb6'
    ],
    'Design Assets': [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
      'https://images.unsplash.com/photo-1561070791-2526d30994b5',
      'https://images.unsplash.com/photo-1558655146-d49348e9d04b',
      'https://images.unsplash.com/photo-1626908013943-df94de54984c',
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113'
    ],
    'Software Tools': [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
      'https://images.unsplash.com/photo-1518770660439-4636190af475',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158'
    ],
    'Study Materials': [
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
      'https://images.unsplash.com/photo-1516116216624-53e697fedbea',
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173',
      'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45',
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644'
    ]
  };

  const adjectives = ['Premium', 'Advanced', 'Ultimate', 'Essential', 'Complete', 'Modern', 'Professional', 'Elite', 'Starter', 'Comprehensive'];
  
  const nouns = {
    'eBooks': ['Guide', 'Handbook', 'Manual', 'Masterclass', 'Blueprint'],
    'Templates': ['UI Kit', 'Dashboard', 'Landing Page', 'Portfolio', 'Admin Theme'],
    'Design Assets': ['Icon Set', 'Backgrounds', 'Vector Pack', 'Illustration Kit', 'Mockups'],
    'Software Tools': ['Analyzer', 'Manager', 'Optimizer', 'Generator', 'Suite'],
    'Study Materials': ['Cheat Sheet', 'Prep Guide', 'Flashcards', 'Notes', 'Practice Kit']
  };

  categories.forEach(category => {
    const loopCount = category === 'eBooks' ? 1 : 5;
    for (let i = 1; i <= loopCount; i++) {
      const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
      const noun = nouns[category][Math.floor(Math.random() * nouns[category].length)];
      
      const title = category === 'eBooks' ? 'Milk and Honey' : `${adjective} ${category.slice(0, -1)} ${noun} v${i}.0`;
      
      const price = Math.floor(Math.random() * 4001) + 1000;
      const hasDiscount = Math.random() > 0.5;
      const originalPrice = hasDiscount ? price + Math.floor(Math.random() * 1000) + 200 : 0;
      
      const catImages = images[category];
      const image = catImages[i - 1]; // Unique image per product
      
      products.push({
        title,
        description: `This is a high-quality, professionally crafted ${category.toLowerCase()} product. Designed specifically to help you save time, improve your workflow, and achieve outstanding results. Grab this ${adjective.toLowerCase()} resource today!`,
        price: parseFloat(price.toFixed(2)),
        originalPrice: parseFloat(originalPrice.toFixed(2)),
        category,
        image,
        imageUrl: image,
        tags: [category.toLowerCase(), noun.toLowerCase(), 'premium', 'digital'],
        stock: 999,
      });
    }
  });

  return products;
};

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/monika');
    console.log('MongoDB connected');

    const products = generateProducts();
    await Product.insertMany(products);
    
    console.log(`Successfully inserted ${products.length} products (10 per category).`);
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
