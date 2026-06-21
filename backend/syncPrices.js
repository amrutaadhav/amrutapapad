const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const updatePricesForTwoPrices = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const products = await Product.find({});
    
    let updateCount = 0;
    for (const product of products) {
      if (!product.originalPrice || product.originalPrice <= product.price) {
        product.originalPrice = Math.round(product.price * 1.25); // Automatically set a 25% higher cut line price
        await product.save();
        updateCount++;
      }
    }

    console.log(`Successfully generated automatic cut-line prices for ${updateCount} products.`);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

updatePricesForTwoPrices();
