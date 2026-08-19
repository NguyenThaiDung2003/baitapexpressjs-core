const Employee = require('../models/Employee');
const AppError = require('../utils/AppError');

// GET /api/employees
const getAllEmployees = (req, res, next) => {
  try {
    const employees = Employee.getAll();
    res.status(200).json({
      status: 'success',
      data: employees
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/employees/:id
const getEmployeeById = (req, res, next) => {
  try {
    const employee = Employee.findById(req.params.id);
    if (!employee) {
      return next(new AppError('Không tìm thấy nhân viên', 404));
    }
    res.status(200).json({
      status: 'success',
      data: employee
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/employees
const createEmployee = (req, res, next) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return next(new AppError('Thiếu thông tin name hoặc email', 400));
    }

    const existingEmployee = Employee.findByEmail(email);
    if (existingEmployee) {
      return next(new AppError('Email đã tồn tại', 409));
    }

    const newEmployee = Employee.create({ name, email });
    res.status(201).json({
      status: 'success',
      data: newEmployee
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/employees/:id/avatar
const uploadAvatar = (req, res, next) => {
  try {
    const employee = Employee.findById(req.params.id);
    if (!employee) {
      return next(new AppError('Không tìm thấy nhân viên', 404));
    }

    if (!req.file) {
      return next(new AppError('Vui lòng chọn file ảnh đại diện', 400));
    }

    const avatarUrl = `/uploads/${req.file.filename}`;
    const updatedEmployee = Employee.updateAvatar(req.params.id, avatarUrl);

    res.status(200).json({
      status: 'success',
      message: 'Cập nhật ảnh đại diện thành công',
      data: updatedEmployee
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  uploadAvatar
};