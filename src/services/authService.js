const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');
const UserConfig = require('../models/UserConfig');

/**
 * Auth Service
 * Xử lý logic liên quan đến authentication
 */

/**
 * Tạo JWT Token
 * @param {String} userId - ID của user
 * @returns {String} - JWT Token
 */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRE }
  );
};

/**
 * Đăng ký user mới
 * @param {Object} userData - Thông tin user (username, email, password, full_name)
 */
const registerUser = async (userData) => {
  try {
    const { username, email, password, full_name } = userData;

    // Kiểm tra user đã tồn tại chưa
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw { statusCode: 400, message: 'Email already exists' };
      }
      if (existingUser.username === username) {
        throw { statusCode: 400, message: 'Username already exists' };
      }
    }

    // Tạo user mới
    const user = await User.create({
      username,
      email,
      password,
      full_name,
    });

    // Tạo config mặc định cho user
    await UserConfig.create({
      user_id: user._id,
    });

    // Tạo token
    const token = generateToken(user._id);

    return {
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
        },
        token,
      },
    };
  } catch (error) {
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || 'Registration failed',
    };
  }
};

/**
 * Đăng nhập
 * @param {String} identifier - Username hoặc Email
 * @param {String} password - Mật khẩu
 */
const loginUser = async (identifier, password) => {
  try {
    // Tìm user theo username hoặc email
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    }).select('+password');

    if (!user) {
      throw { statusCode: 401, message: 'Invalid credentials' };
    }

    // Kiểm tra password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw { statusCode: 401, message: 'Invalid credentials' };
    }

    // Tạo token
    const token = generateToken(user._id);

    return {
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
        },
        token,
      },
    };
  } catch (error) {
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || 'Login failed',
    };
  }
};

/**
 * Lấy thông tin user hiện tại
 * @param {String} userId - ID của user
 */
const getCurrentUser = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw { statusCode: 404, message: 'User not found' };
    }

    return {
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          created_at: user.created_at,
        },
      },
    };
  } catch (error) {
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to get user info',
    };
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  generateToken,
};
