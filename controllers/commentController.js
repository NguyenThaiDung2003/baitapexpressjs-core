const Comment = require('../models/Comment');
const Post = require('../models/Post');
const AppError = require('../utils/AppError');

const createComment = (req, res, next) => {
  try {
    const { postId, content } = req.body;
    if (!postId || !content) {
      return next(new AppError('Thiếu postId hoặc nội dung bình luận', 400));
    }

    // Kiểm tra post có tồn tại không
    const post = Post.findById(postId);
    if (!post) {
      return next(new AppError('Bài viết không tồn tại', 404));
    }

    const newComment = Comment.create({
      postId,
      content,
      userId: req.user.id
    });

    res.status(201).json({ success: true, data: newComment });
  } catch (err) {
    next(err);
  }
};

module.exports = { createComment };