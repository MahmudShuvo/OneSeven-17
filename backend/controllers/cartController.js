const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get current cart with populated products
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('cart.product');
  res.json(user.cart);
});

// @desc    Add item to cart (or increment quantity)
// @route   POST /api/cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const user = await User.findById(req.user._id);
  const existing = user.cart.find((item) => item.product.toString() === productId);
  if (existing) {
    existing.quantity += Number(quantity);
  } else {
    user.cart.push({ product: productId, quantity });
  }
  await user.save();
  const updated = await User.findById(req.user._id).populate('cart.product');
  res.status(201).json(updated.cart);
});

// @desc    Update item quantity
// @route   PUT /api/cart/:productId
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const user = await User.findById(req.user._id);
  const item = user.cart.find((i) => i.product.toString() === productId);
  if (!item) {
    res.status(404);
    throw new Error('Item not in cart');
  }
  if (quantity <= 0) {
    user.cart = user.cart.filter((i) => i.product.toString() !== productId);
  } else {
    item.quantity = quantity;
  }
  await user.save();
  const updated = await User.findById(req.user._id).populate('cart.product');
  res.json(updated.cart);
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const user = await User.findById(req.user._id);
  user.cart = user.cart.filter((i) => i.product.toString() !== productId);
  await user.save();
  const updated = await User.findById(req.user._id).populate('cart.product');
  res.json(updated.cart);
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.cart = [];
  await user.save();
  res.json([]);
});

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
