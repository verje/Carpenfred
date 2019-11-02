const cloudinary = require('cloudinary').v2;
const keys = require('../config/keys');
cloudinary.config({
  cloud_name: keys.cloudinary.cloudname,
  api_key: keys.cloudinary.API_KEY,
  api_secret: keys.cloudinary.API_SECRET
})