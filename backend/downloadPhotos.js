const fs = require('fs');
const path = require('path');
const https = require('https');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        res.pipe(fs.createWriteStream(filepath))
           .on('error', reject)
           .once('close', () => resolve(filepath));
      } else {
        // Consume response data to free up memory
        res.resume();
        reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
      }
    }).on('error', reject);
  });
};

const backupPhotos = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const products = await Product.find({});
    
    // Create folder on desktop
    const desktopPath = path.join(require('os').homedir(), 'OneDrive', 'Desktop', 'AmrutaPapad_Photos');
    if (!fs.existsSync(desktopPath)) {
      fs.mkdirSync(desktopPath, { recursive: true });
    }

    console.log(`Starting download of ${products.length} product photos...`);

    for (const product of products) {
      if (product.image && product.image.startsWith('http')) {
        // Clean URL to prevent issues
        const cleanUrl = product.image;
        // make sure the url is using https
        const secureUrl = cleanUrl.replace('http://', 'https://');
        
        // create a safe filename
        const filename = product.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.jpg';
        const filepath = path.join(desktopPath, filename);
        
        console.log(`Downloading ${product.name}...`);
        try {
          await downloadImage(secureUrl, filepath);
          console.log(`Saved to ${filepath}`);
        } catch(e) {
          console.error(`Failed to download ${product.name}:`, e.message);
        }
      }
    }

    console.log('All photos successfully backed up to your Desktop!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

backupPhotos();
