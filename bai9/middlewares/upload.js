const multer = require('multer');
const path = require('path');
const AppError = require('../utils/AppError');

// Cấu hình lưu trữ
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${uniqueSuffix}${ext}`);
  }
});

// Validator lọc định dạng file
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new AppError('Chỉ chấp nhận file ảnh (image/*)', 400), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // Giới hạn 2MB
  },
  fileFilter: fileFilter
});

module.exports = upload;