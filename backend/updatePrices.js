const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const updatePrices = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const products = await Product.find({});
    for (const product of products) {
      if (!product.originalPrice || product.originalPrice === 0) {
        // Set an original price (e.g., 20% higher than the current price)
        product.originalPrice = Math.round(product.price * 1.2);
        await product.save();
      }
    }
    console.log('Successfully updated all products to have an original price!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

updatePrices();
