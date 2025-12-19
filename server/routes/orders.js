const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

// All order routes require authentication

// Get all orders
router.get('/', authenticate, (req, res) => {
  res.status(501).json({ success: false, error: { message: 'Not implemented yet' } });
});

// Get single order
router.get('/:orderId', authenticate, (req, res) => {
  res.status(501).json({ success: false, error: { message: 'Not implemented yet' } });
});

// Create order
router.post('/', authenticate, (req, res) => {
  res.status(501).json({ success: false, error: { message: 'Not implemented yet' } });
});

module.exports = router;
