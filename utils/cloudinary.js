const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadToCloudinary = async (fileBuffer, options = {}) => {
  const result = await cloudinary.uploader.upload_stream(
    options,
    (error, result) => {
      if (error) throw error;
      return result;
    }
  );

  return result;
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
};
