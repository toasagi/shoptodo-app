const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const todoRoutes = require('./routes/todos');

const app = express();

// Middleware
app.use(cors({
  origin: config.cors.origins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/todos', todoRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  const PORT = config.server.port;
  app.listen(PORT, () => {
    console.log(`ShopTodo server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
}

module.exports = app;
