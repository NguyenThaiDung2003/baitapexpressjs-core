const express = require('express');
const path = require('path');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const AppError = require('./utils/AppError');

const app = express();

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

// 404 handler
app.all('/{*splat}', (req, res, next) => {
  next(new AppError(`Không tìm thấy endpoint ${req.originalUrl}`, 404));
});

// Global Error Handler (Đảm bảo đúng 4 tham số)
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Lỗi hệ thống'
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));