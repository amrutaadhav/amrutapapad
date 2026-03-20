const path = require('path');
const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'amrutapapad_uploads',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

const upload = multer({ storage });

router.post('/', upload.single('image'), (req, res) => {
  res.send(req.file.path); // returns the Cloudinary URL directly
});

router.post('/multiple', upload.array('images', 5), (req, res) => {
  const filePaths = req.files.map((file) => file.path);
  res.send(filePaths); // returns array of Cloudinary URLs
});

module.exports = router;
