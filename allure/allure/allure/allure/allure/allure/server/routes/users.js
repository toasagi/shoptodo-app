const express = require('express');
const router = express.Router();
const dataService = require('../services/dataService');
const authService = require('../services/authService');
const { asyncHandler, AppError } = require('../middleware/errorHandler');
const { authenticate } = require('../middleware/auth');

/**
 * @route GET /api/users/me
 * @desc Get current user's profile
 * @access Private
 */
router.get('/me', authenticate, asyncHandler(async (req, res) => {
  const user = await dataService.findUserById(req.user.userId);

  if (!user) {
    throw new AppError('USER_NOT_FOUND');
  }

  res.json({
    success: true,
    data: authService.sanitizeUser(user)
  });
}));

/**
 * @route PUT /api/users/me
 * @desc Update current user's profile
 * @access Private
 */
router.put('/me', authenticate, asyncHandler(async (req, res) => {
  const { displayName, phone, paymentMethod, email } = req.body;

  // If email is being changed, check if it's already taken
  if (email) {
    const existingEmail = await dataService.findUserByEmail(email);
    if (existingEmail && existingEmail.id !== req.user.userId) {
      throw new AppError('EMAIL_EXISTS');
    }
  }

  const updates = {
    profile: {}
  };

  if (email) updates.email = email;
  if (displayName !== undefined) updates.profile.displayName = displayName;
  if (phone !== undefined) updates.profile.phone = phone;
  if (paymentMethod !== undefined) updates.profile.paymentMethod = paymentMethod;

  // Merge with existing profile
  const currentUser = await dataService.findUserById(req.user.userId);
  if (currentUser) {
    updates.profile = {
      ...currentUser.profile,
      ...updates.profile
    };
  }

  const updatedUser = await dataService.updateUser(req.user.userId, updates);

  if (!updatedUser) {
    throw new AppError('USER_NOT_FOUND');
  }

  res.json({
    success: true,
    data: authService.sanitizeUser(updatedUser)
  });
}));

/**
 * @route POST /api/users/migrate
 * @desc Migrate localStorage data to server
 * @access Private
 */
router.post('/migrate', authenticate, asyncHandler(async (req, res) => {
  const { cart, orders, todos } = req.body;

  const result = await dataService.migrateUserData(req.user.userId, {
    cart,
    orders,
    todos
  });

  res.json({
    success: true,
    data: result
  });
}));

module.exports = router;
