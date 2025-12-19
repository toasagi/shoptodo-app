const express = require('express');
const router = express.Router();

// Placeholder routes - will be implemented in Step 2
router.post('/register', (req, res) => {
  res.status(501).json({ success: false, error: { message: 'Not implemented yet' } });
});

router.post('/login', (req, res) => {
  res.status(501).json({ success: false, error: { message: 'Not implemented yet' } });
});

module.exports = router;
