const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Create new order (checkout)
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { items, shipping, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }
  if (!shipping) {
    res.status(400);
    throw new Error('Shipping info required');
  }

  // Re-price on server using DB to prevent tampering
  const populated = [];
  let itemsPrice = 0;
  for (const it of items) {
    const product = await Product.findById(it.product);
    if (!product) {
      res.status(404);
      throw new Error(`Product not found: ${it.product}`);
    }
    if (product.stock < it.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for ${product.name}`);
    }
    populated.push({
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: it.quantity,
      size: it.size || 'M',
    });
    itemsPrice += product.price * it.quantity;
  }

  const shippingPrice = itemsPrice > 5000 ? 0 : 100; // Free shipping over 5000 BDT
  const taxPrice = Number((itemsPrice * 0.05).toFixed(2)); // 5%
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const order = await Order.create({
    user: req.user._id,
    items: populated,
    shipping,
    paymentMethod: paymentMethod || 'Cash on Delivery',
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  });

  // Decrement stock & clear user cart
  for (const it of populated) {
    await Product.findByIdAndUpdate(it.product, { $inc: { stock: -it.quantity } });
  }
  await User.findByIdAndUpdate(req.user._id, { cart: [] });

  res.status(201).json(order);
});

// @desc    Get my orders
// @route   GET /api/orders/my
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
  res.json(orders);
});

// @desc    Get one order
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  if (!req.user.isAdmin && order.user._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }
  res.json(order);
});

// @desc    Mark order paid (mock payment)
// @route   PUT /api/orders/:id/pay
// @access  Private
const payOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  order.isPaid = true;
  order.paidAt = Date.now();
  order.status = 'Processing';
  const updated = await order.save();
  res.json(updated);
});

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort('-createdAt');
  res.json(orders);
});

module.exports = { createOrder, getMyOrders, getOrderById, payOrder, getAllOrders };
