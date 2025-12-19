const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const user = await authService.register(username, email, password);

  res.status(201).json({
    success: true,
    data: {
      user,
      message: 'Registration successful'
    }
  });
}));

/**
 * @route POST /api/auth/login
 * @desc Authenticate user and get token
 * @access Public
 */
router.post('/login', asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const result = await authService.login(username, password);

  res.json({
    success: true,
    data: result
  });
}));

module.exports = router;
