const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendOtpEmail } = require('../utils/emailService');

// In-memory OTP store: email -> { otp, expiresAt, name, password }
const otpStore = new Map();

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const safeError = (res, err, status = 500) => {
  console.error(err);
  res.status(status).json({ message: status < 500 ? err.message : 'Internal server error' });
};

exports.sendOtp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password)
      return res.status(400).json({ message: 'Name, email and password are required' });
    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ message: 'Invalid email address' });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email.toLowerCase(), { otp, expiresAt: Date.now() + 10 * 60 * 1000, name: name.trim(), password });

    try {
      await sendOtpEmail(email, otp);
    } catch (emailErr) {
      otpStore.delete(email.toLowerCase());
      console.error('Email send failed:', emailErr);
      return res.status(500).json({ message: emailErr.message || 'Failed to send OTP email.' });
    }

    res.json({ message: 'OTP sent to your email' });
  } catch (err) {
    safeError(res, err);
  }
};

exports.signup = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email?.trim() || !otp)
      return res.status(400).json({ message: 'Email and OTP are required' });

    const record = otpStore.get(email.toLowerCase());
    if (!record) return res.status(400).json({ message: 'OTP not found. Please request a new one.' });
    if (Date.now() > record.expiresAt) {
      otpStore.delete(email.toLowerCase());
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }
    if (record.otp !== otp.trim())
      return res.status(400).json({ message: 'Invalid OTP' });

    otpStore.delete(email.toLowerCase());

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name: record.name, email: email.toLowerCase(), password: record.password });
    const token = generateToken(user._id);

    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    safeError(res, err);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, location: user.location } });
  } catch (err) {
    safeError(res, err);
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email?.trim()) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: 'No account found with this email' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(`reset_${email.toLowerCase()}`, { otp, expiresAt: Date.now() + 10 * 60 * 1000 });

    try {
      await sendOtpEmail(email, otp, 'reset');
    } catch (emailErr) {
      otpStore.delete(`reset_${email.toLowerCase()}`);
      console.error('Email send failed:', emailErr);
      return res.status(500).json({ message: emailErr.message || 'Failed to send OTP email.' });
    }

    res.json({ message: 'OTP sent to your email' });
  } catch (err) {
    safeError(res, err);
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email?.trim() || !otp || !newPassword)
      return res.status(400).json({ message: 'Email, OTP and new password are required' });
    if (newPassword.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const record = otpStore.get(`reset_${email.toLowerCase()}`);
    if (!record) return res.status(400).json({ message: 'OTP not found. Please request a new one.' });
    if (Date.now() > record.expiresAt) {
      otpStore.delete(`reset_${email.toLowerCase()}`);
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }
    if (record.otp !== otp.trim()) return res.status(400).json({ message: 'Invalid OTP' });

    otpStore.delete(`reset_${email.toLowerCase()}`);

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: 'User not found' });

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    safeError(res, err);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone, location } = req.body;

    if (!name?.trim() || !email?.trim())
      return res.status(400).json({ message: 'Name and email are required' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ message: 'Invalid email address' });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name: name.trim(), email: email.toLowerCase(), phone: phone?.trim(), location: location?.trim() },
      { new: true, runValidators: true }
    );

    res.json({ user: { id: user._id, name: user.name, email: user.email, phone: user.phone, location: user.location } });
  } catch (err) {
    safeError(res, err);
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: 'Both current and new password are required' });
    if (newPassword.length < 6)
      return res.status(400).json({ message: 'New password must be at least 6 characters' });

    const user = await User.findById(req.user.id);
    if (!(await user.comparePassword(currentPassword)))
      return res.status(400).json({ message: 'Current password is incorrect' });

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    safeError(res, err);
  }
};
