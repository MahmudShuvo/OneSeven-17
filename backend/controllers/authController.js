const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const signup = asyncHandler(async (req, res) => {
  const { name, email, password, phone, address } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email, and password');
  }

  if (!EMAIL_RE.test(email)) {
    res.status(400);
    throw new Error('Please enter a valid email address');
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters');
  }

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    res.status(400);
    throw new Error('This email is already registered');
  }

  const user = await User.create({ name, email, password, phone, address });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    isAdmin: user.isAdmin,
    token: generateToken(user._id),
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (user && (await user.matchPassword(password))) {
    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  }
  res.status(401);
  throw new Error('Invalid email or password');
});

// @desc    Get logged-in user profile
// @route   GET /api/auth/me
// @access  Private
const me = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = { signup, login, me };
