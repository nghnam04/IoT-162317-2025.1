const authService = require('../services/authService');

/**
 * Auth Controller
 * Xử lý các request liên quan đến authentication
 */

/**
 * @route   POST /api/v1/auth/register
 * @desc    Đăng ký tài khoản mới
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { username, email, password, full_name } = req.body;

    const result = await authService.registerUser({
      username,
      email,
      password,
      full_name,
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/v1/auth/login
 * @desc    Đăng nhập
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    const result = await authService.loginUser(identifier, password);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/v1/auth/me
 * @desc    Lấy thông tin user hiện tại
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    const result = await authService.getCurrentUser(req.user._id);

    res.status(200).json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
};
