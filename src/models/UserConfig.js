const mongoose = require('mongoose');

const userConfigSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  notifications: {
    email_alert: {
      type: Boolean,
      default: true,
    },
    push_alert: {
      type: Boolean,
      default: false,
    },
  },
  thresholds: {
    max_temp: {
      type: Number,
      default: 35,
      min: 0,
      max: 100,
    },
    min_humidity: {
      type: Number,
      default: 40,
      min: 0,
      max: 100,
    },
    max_humidity: {
      type: Number,
      default: 80,
      min: 0,
      max: 100,
    },
    min_light: {
      type: Number,
      default: 200,
      min: 0,
    },
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Tự động cập nhật updated_at khi có thay đổi
userConfigSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('UserConfig', userConfigSchema);
