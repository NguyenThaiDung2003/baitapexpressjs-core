const express = require('express');
const AppError = require('./utils/AppError');

const app = express();
app.use(express.json());

// Dữ liệu mẫu
const users = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' }
];

// --- ROUTES ---

// 1. GET /users/secret (Đặt lên trước /users/:id để tránh bị đè route)
app.get('/users/secret', (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(new AppError('Chưa xác thực', 401));
  }
  res.status(200).json({ success: true, message: 'Dữ liệu bảo mật' });
});

// 2. GET /users/:id
app.get('/users/:id', (req, res, next) => {
  const userId = Number(req.params.id);
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return next(new AppError('Không tìm thấy user', 404));
  }

  res.status(200).json({ success: true, data: user });
});

// 3. POST /users
app.post('/users', (req, res, next) => {
  const { email, name } = req.body;

  if (!email) {
    return next(new AppError('Thiếu trường email', 400));
  }

  const newUser = { id: users.length + 1, name, email };
  users.push(newUser);

  res.status(201).json({ success: true, data: newUser });
});

// --- GLOBAL ERROR HANDLING MIDDLEWARE ---
// Middleware xử lý lỗi tập trung đặt ở CỦA CÙNG, đúng 4 tham số (err, req, res, next)
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Lỗi hệ thống'
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});