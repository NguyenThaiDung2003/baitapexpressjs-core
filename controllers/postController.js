const Post = require('../models/Post');
const Comment = require('../models/Comment');
const AppError = require('../utils/AppError');

const getPosts = (req, res, next) => {
  try {
    const posts = Post.getAll();
    res.status(200).json({ success: true, data: posts });
  } catch (err) {
    next(err);
  }
};

const getPostById = (req, res, next) => {
  try {
    const post = Post.findById(req.params.id);
    if (!post) {
      return next(new AppError('Bài viết không tồn tại', 404));
    }
    const comments = Comment.findByPostId(req.params.id);
    res.status(200).json({ success: true, data: { ...post, comments } });
  } catch (err) {
    next(err);
  }
};

const createPost = (req, res, next) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return next(new AppError('Thiếu thông tin tiêu đề hoặc nội dung', 400));
    }

    const thumbnailUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const newPost = Post.create({ title, content, thumbnailUrl });

    res.status(201).json({ success: true, data: newPost });
  } catch (err) {
    next(err);
  }
};

const deletePost = (req, res, next) => {
  try {
    const postId = req.params.id;
    const post = Post.findById(postId);
    if (!post) {
      return next(new AppError('Bài viết không tồn tại', 404));
    }

    // Cascade delete: Xóa bài viết và toàn bộ comment thuộc post đó
    Post.deleteById(postId);
    Comment.deleteByPostId(postId);

    res.status(200).json({
      success: true,
      message: 'Xóa bài viết và toàn bộ bình luận liên quan thành công'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getPosts, getPostById, createPost, deletePost };