const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const dataService = require('../services/dataService');
const { asyncHandler, AppError } = require('../middleware/errorHandler');
const { authenticate } = require('../middleware/auth');

/**
 * @route GET /api/orders
 * @desc Get all user's orders
 * @access Private
 */
router.get('/', authenticate, asyncHandler(async (req, res) => {
  const orders = await dataService.getOrders(req.user.userId);

  res.json({
    success: true,
    data: orders
  });
}));

/**
 * @route GET /api/orders/:orderId
 * @desc Get single order by ID
 * @access Private
 */
router.get('/:orderId', authenticate, asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const order = await dataService.getOrderById(req.user.userId, orderId);

  if (!order) {
    throw new AppError('NOT_FOUND', 'Order not found');
  }

  res.json({
    success: true,
    data: order
  });
}));

/**
 * @route POST /api/orders
 * @desc Create a new order from cart
 * @access Private
 */
router.post('/', authenticate, asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;

  // If no items provided, use current cart
  let orderItems = items;
  if (!orderItems || orderItems.length === 0) {
    orderItems = await dataService.getCart(req.user.userId);
  }

  if (!orderItems || orderItems.length === 0) {
    throw new AppError('VALIDATION_ERROR', 'No items to order');
  }

  // Calculate total
  const total = orderItems.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);

  const order = {
    id: uuidv4(),
    items: orderItems.map(item => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image || ''
    })),
    total,
    shippingAddress: shippingAddress || {},
    paymentMethod: paymentMethod || 'unspecified',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  await dataService.createOrder(req.user.userId, order);

  // Clear cart after order
  await dataService.clearCart(req.user.userId);

  res.status(201).json({
    success: true,
    data: order
  });
}));

module.exports = router;
