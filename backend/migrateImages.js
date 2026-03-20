const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Product = require('./models/Product.js');

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImages = async () => {
  try {
    const frontendImagesDir = path.join(__dirname, '../frontend/public/images');
    const images = fs.readdirSync(frontendImagesDir);
    const urlMap = {};

    for (const image of images) {
      const fullPath = path.join(frontendImagesDir, image);
      if (fs.lstatSync(fullPath).isFile()) {
        console.log(`Uploading ${image}...`);
        const result = await cloudinary.uploader.upload(fullPath, {
          folder: 'amrutapapad_uploads',
        });
        urlMap[`/images/${image}`] = result.secure_url;
        console.log(`Uploaded! URL: ${result.secure_url}`);
      }
    }

    console.log('Image URL Mapping:', urlMap);

    // Output mapped file to easily replace in products.js if needed
    fs.writeFileSync('cloudinary_map.json', JSON.stringify(urlMap, null, 2));

    console.log('Migration Complete!');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

uploadImages();
