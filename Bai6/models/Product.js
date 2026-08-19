let products = [
  { id: 1, name: "Laptop", price: 15000000, quantity: 10 },
  { id: 2, name: "Mouse", price: 250000, quantity: 50 }
];

let nextId = 3;

const getAll = () => {
  return products;
};

const create = (data) => {
  const newProduct = {
    id: nextId++,
    name: data.name,
    price: data.price,
    quantity: data.quantity
  };
  products.push(newProduct);
  return newProduct;
};

const findById = (id) => {
  return products.find((product) => product.id === Number(id));
};

module.exports = {
  getAll,
  create,
  findById
};