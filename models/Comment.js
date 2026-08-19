let comments = [
  { id: 1, postId: 1, content: 'Bình luận 1 cho post 1', userId: 2 },
  { id: 2, postId: 1, content: 'Bình luận 2 cho post 1', userId: 1 }
];

let nextId = 3;

const create = (data) => {
  const newComment = {
    id: nextId++,
    postId: Number(data.postId),
    content: data.content,
    userId: data.userId
  };
  comments.push(newComment);
  return newComment;
};

const findByPostId = (postId) => {
  return comments.filter((c) => c.postId === Number(postId));
};

const deleteByPostId = (postId) => {
  comments = comments.filter((c) => c.postId !== Number(postId));
};

module.exports = { create, findByPostId, deleteByPostId };
