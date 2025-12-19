const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const dataService = require('../services/dataService');
const { asyncHandler, AppError } = require('../middleware/errorHandler');
const { authenticate } = require('../middleware/auth');

/**
 * @route GET /api/cart
 * @desc Get user's cart
 * @access Private
 */
router.get('/', authenticate, asyncHandler(async (req, res) => {
  const cart = await dataService.getCart(req.user.userId);

  res.json({
    success: true,
    data: cart
  });
}));

/**
 * @route POST /api/cart
 * @desc Add item to cart
 * @access Private
 */
router.post('/', authenticate, asyncHandler(async (req, res) => {
  const { productId, name, price, quantity = 1, image } = req.body;

  if (!productId || !name || price === undefined) {
    throw new AppError('VALIDATION_ERROR', 'Product ID, name, and price are required');
  }

  const cart = await dataService.getCart(req.user.userId);

  // Check if product already exists in cart
  const existingIndex = cart.findIndex(item => item.productId === productId);

  if (existingIndex !== -1) {
    // Update quantity
    cart[existingIndex].quantity += quantity;
  } else {
    // Add new item
    cart.push({
      id: uuidv4(),
      productId,
      name,
      price,
      quantity,
      image: image || '',
      addedAt: new Date().toISOString()
    });
  }

  await dataService.saveCart(req.user.userId, cart);

  res.status(201).json({
    success: true,
    data: cart
  });
}));

/**
 * @route PUT /api/cart/:productId
 * @desc Update cart item quantity
 * @access Private
 */
router.put('/:productId', authenticate, asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (quantity === undefined || quantity < 0) {
    throw new AppError('VALIDATION_ERROR', 'Valid quantity is required');
  }

  const cart = await dataService.getCart(req.user.userId);
  const itemIndex = cart.findIndex(item => item.productId === productId);

  if (itemIndex === -1) {
    throw new AppError('CART_ITEM_NOT_FOUND');
  }

  if (quantity === 0) {
    // Remove item if quantity is 0
    cart.splice(itemIndex, 1);
  } else {
    cart[itemIndex].quantity = quantity;
  }

  await dataService.saveCart(req.user.userId, cart);

  res.json({
    success: true,
    data: cart
  });
}));

/**
 * @route DELETE /api/cart/:productId
 * @desc Remove item from cart
 * @access Private
 */
router.delete('/:productId', authenticate, asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const cart = await dataService.getCart(req.user.userId);
  const itemIndex = cart.findIndex(item => item.productId === productId);

  if (itemIndex === -1) {
    throw new AppError('CART_ITEM_NOT_FOUND');
  }

  cart.splice(itemIndex, 1);
  await dataService.saveCart(req.user.userId, cart);

  res.json({
    success: true,
    data: cart
  });
}));

/**
 * @route DELETE /api/cart
 * @desc Clear entire cart
 * @access Private
 */
router.delete('/', authenticate, asyncHandler(async (req, res) => {
  await dataService.clearCart(req.user.userId);

  res.json({
    success: true,
    data: []
  });
}));

module.exports = router;
