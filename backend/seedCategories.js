const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

const newProducts = [
  {
    name: 'Gahu Shevai (Wheat Noodles)',
    image: 'https://res.cloudinary.com/dukzvvjrl/image/upload/v1774286208/6_ymx90e.jpg',
    description: 'Traditional homemade wheat shevai. Perfect for upma or kheer.',
    category: 'Shevai',
    price: 150,
    countInStock: 20,
    rating: 4.5,
    numReviews: 10
  },
  {
    name: 'Goda Masala',
    image: 'https://res.cloudinary.com/dukzvvjrl/image/upload/v1774286223/5_vyj9x7.jpg',
    description: 'Authentic Maharashtrian Goda Masala for everyday cooking.',
    category: 'Masale',
    price: 250,
    countInStock: 50,
    rating: 4.8,
    numReviews: 35
  },
  {
    name: 'Kanda Lasun Masala',
    image: 'https://res.cloudinary.com/dukzvvjrl/image/upload/v1774286222/3_afegrp.jpg',
    description: 'Spicy onion-garlic spice blend, essential for misal and curries.',
    category: 'Masale',
    price: 300,
    countInStock: 40,
    rating: 4.9,
    numReviews: 42
  },
  {
    name: 'Moong Dal Sandage',
    image: 'https://res.cloudinary.com/dukzvvjrl/image/upload/v1774286220/4_ckrqkd.jpg',
    description: 'Protein-rich sun-dried moong dal drops (Sandage) used to make traditional amti/curry.',
    category: 'Sandage',
    price: 200,
    countInStock: 15,
    rating: 4.6,
    numReviews: 18
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const adminUser = await User.findOne({ isAdmin: true });
    if (!adminUser) {
      console.log('No admin user found!');
      process.exit(1);
    }

    const sampleProducts = newProducts.map((p) => {
      return { ...p, user: adminUser._id };
    });

    // We use insertMany so we don't wipe existing papads, just add new categories
    await Product.insertMany(sampleProducts);
    console.log('New Category Products Inserted Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
