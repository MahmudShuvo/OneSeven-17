const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  payOrder,
  getAllOrders,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

router.route('/').post(protect, createOrder).get(protect, admin, getAllOrders);
router.get('/my', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, payOrder);

module.exports = router;
