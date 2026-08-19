const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { authenticate, authorize } = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const AppError = require('../utils/AppError');

router.get('/', postController.getPosts);
router.get('/:id', postController.getPostById);

// Middleware bọc upload single file
router.post(
  '/',
  (req, res, next) => {
    upload.single('thumbnail')(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new AppError('File vượt quá dung lượng cho phép (2MB)', 400));
        }
        return next(err);
      }
      next();
    });
  },
  postController.createPost
);

// Bắt buộc qua cả authenticate và authorize('admin')
router.delete('/:id', authenticate, authorize('admin'), postController.deletePost);

module.exports = router;