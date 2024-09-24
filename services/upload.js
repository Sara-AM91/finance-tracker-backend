// import multer, cloudinary and cloudinaryStorage
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// configuring the cloudinary account using your credentials
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// CloudinaryStorage helps us to create a storage option, which is required by multer to upload the file to a particular destination.
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "app", // name for the folder in the cloud
    allowedFormats: ["jpg", "png", "jpeg", "pdf"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});
const upload = multer({ storage: storage });
module.exports = upload;
