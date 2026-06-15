const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif/;

  if (
    allowed.test(file.mimetype) &&
    allowed.test(path.extname(file.originalname).toLowerCase())
  ) {
    cb(null, true); // Accept file
  } else {
    cb(new Error("Only image files are allowed")); // Reject file
  }
};


const upload = multer({
  storage: storage, fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 * 1,
  },
});

module.exports = upload;
