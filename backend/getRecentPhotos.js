const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

cloudinary.search
  .expression('resource_type:image')
  .sort_by('uploaded_at','desc')
  .max_results(10)
  .execute()
  .then(result => {
    console.log(JSON.stringify(result.resources.map(r => r.secure_url), null, 2));
  })
  .catch(error => {
    console.error('Error fetching from Cloudinary:', error);
  });
