let posts = [
  {
    id: 1,
    title: 'Bài viết mẫu đầu tiên',
    content: 'Nội dung bài viết mẫu...',
    thumbnailUrl: null
  }
];

let nextId = 2;

const getAll = () => posts;

const findById = (id) => posts.find((p) => p.id === Number(id));

const create = (data) => {
  const newPost = {
    id: nextId++,
    title: data.title,
    content: data.content,
    thumbnailUrl: data.thumbnailUrl || null
  };
  posts.push(newPost);
  return newPost;
};

const deleteById = (id) => {
  const index = posts.findIndex((p) => p.id === Number(id));
  if (index !== -1) {
    posts.splice(index, 1);
    return true;
  }
  return false;
};

module.exports = { getAll, findById, create, deleteById };