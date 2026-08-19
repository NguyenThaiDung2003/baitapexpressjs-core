let employees = [
  {
    id: 1,
    name: 'Nguyen Van A',
    email: 'ana@example.com',
    avatarUrl: null
  }
];

let nextId = 2;

const getAll = () => {
  return employees;
};

const findById = (id) => {
  return employees.find((emp) => emp.id === Number(id));
};

const findByEmail = (email) => {
  return employees.find((emp) => emp.email === email);
};

const create = (data) => {
  const newEmployee = {
    id: nextId++,
    name: data.name,
    email: data.email,
    avatarUrl: null
  };
  employees.push(newEmployee);
  return newEmployee;
};

const updateAvatar = (id, avatarUrl) => {
  const employee = findById(id);
  if (employee) {
    employee.avatarUrl = avatarUrl;
    return employee;
  }
  return null;
};

module.exports = {
  getAll,
  findById,
  findByEmail,
  create,
  updateAvatar
};