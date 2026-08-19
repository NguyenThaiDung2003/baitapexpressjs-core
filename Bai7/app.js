const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();

// 1. Cấu hình nơi lưu trữ và tên file không trùng lặp
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

// 2. Cấu hình fileFilter để kiểm tra định dạng MIME
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error('Chỉ chấp nhận file ảnh JPEG/PNG/WEBP');
    error.code = 'INVALID_FILE_TYPE';
    cb(error, false);
  }
};

// 3. Khởi tạo Multer với các giới hạn và cấu hình
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB
  },
  fileFilter: fileFilter
}).single('avatar');

// 4. Định nghĩa Route POST /upload/avatar và xử lý lỗi
app.post('/upload/avatar', (req, res) => {
  upload(req, res, (err) => {
    // Xử lý lỗi từ Multer hoặc từ fileFilter
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          message: 'File vượt quá dung lượng cho phép (2MB)'
        });
      }
      if (err.code === 'INVALID_FILE_TYPE') {
        return res.status(400).json({
          message: err.message
        });
      }
      return res.status(400).json({ message: err.message });
    }

    // Kiểm tra xem client đã gửi file chưa
    if (!req.file) {
      return res.status(400).json({ message: 'Vui lòng chọn file để upload' });
    }

    // Response thành công
    res.status(200).json({
      message: 'Upload thành công',
      filename: req.file.filename,
      size: req.file.size
    });
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});