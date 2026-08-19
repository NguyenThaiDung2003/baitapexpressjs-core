const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const upload = require('../middlewares/upload');
const AppError = require('../utils/AppError');

router.get('/', employeeController.getAllEmployees);
router.post('/', employeeController.createEmployee);
router.get('/:id', employeeController.getEmployeeById);

// Middleware bọc upload single file để bắt lỗiMulter fileSize/MIME trước khi qua Controller
router.post(
  '/:id/avatar',
  (req, res, next) => {
    upload.single('avatar')(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new AppError('File vượt quá dung lượng cho phép (2MB)', 400));
        }
        return next(err);
      }
      next();
    });
  },
  employeeController.uploadAvatar
);

module.exports = router;