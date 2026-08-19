const Product = require('../models/Product');

const getProducts = (req, res) => {
  const products = Product.getAll();
  res.status(200).json(products);
};

const createProduct = (req, res) => {
  const { name, price, quantity } = req.body;
  
  if (!name || price === undefined || quantity === undefined) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin sản phẩm' });
  }

  const newProduct = Product.create({ name, price, quantity });
  res.status(201).json(newProduct);
};

module.exports = {
  getProducts,
  createProduct
};