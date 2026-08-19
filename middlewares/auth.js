const AppError = require('../utils/AppError');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(new AppError('Chưa đăng nhập', 401));
  }
  
  // Giả lập lấy role từ header Authorization (vd: 'admin' hoặc 'user')
  const role = authHeader.trim().toLowerCase();
  req.user = {
    id: role === 'admin' ? 1 : 2,
    role: role
  };

  next();
};

const authorize = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return next(new AppError('Không đủ quyền truy cập', 403));
    }
    next();
  };
};

module.exports = { authenticate, authorize };