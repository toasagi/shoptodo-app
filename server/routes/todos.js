const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

// All todo routes require authentication

// Get all todos
router.get('/', authenticate, (req, res) => {
  res.status(501).json({ success: false, error: { message: 'Not implemented yet' } });
});

// Add todo
router.post('/', authenticate, (req, res) => {
  res.status(501).json({ success: false, error: { message: 'Not implemented yet' } });
});

// Toggle todo
router.put('/:todoId', authenticate, (req, res) => {
  res.status(501).json({ success: false, error: { message: 'Not implemented yet' } });
});

// Delete todo
router.delete('/:todoId', authenticate, (req, res) => {
  res.status(501).json({ success: false, error: { message: 'Not implemented yet' } });
});

module.exports = router;
