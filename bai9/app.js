const express = require('express');
const path = require('path');
const employeeRoutes = require('./routes/employeeRoutes');
const AppError = require('./utils/AppError');

const app = express();

// Parsing JSON body
app.use(express.json());

// Serving static files cho các ảnh đã upload
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware logger toàn cục
app.use((req, res, next) => {
  console.log(`[LOG] ${new Date().toISOString()} | ${req.method} ${req.originalUrl}`);
  next();
});

// Routing
app.use('/api/employees', employeeRoutes);

// Xử lý Route không tồn tại (404)
app.all('/{*splat}', (req, res, next) => {
  next(new AppError(`Không tìm thấy endpoint ${req.originalUrl} trên server`, 404));
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Lỗi hệ thống';

  res.status(statusCode).json({
    message: message
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});