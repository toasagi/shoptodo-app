const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const dataService = require('../services/dataService');
const { asyncHandler, AppError } = require('../middleware/errorHandler');
const { authenticate } = require('../middleware/auth');

/**
 * @route GET /api/todos
 * @desc Get all user's todos
 * @access Private
 */
router.get('/', authenticate, asyncHandler(async (req, res) => {
  const todos = await dataService.getTodos(req.user.userId);

  res.json({
    success: true,
    data: todos
  });
}));

/**
 * @route POST /api/todos
 * @desc Add a new todo
 * @access Private
 */
router.post('/', authenticate, asyncHandler(async (req, res) => {
  const { text, productId, productName, productPrice, productImage, quantity } = req.body;

  if (!text) {
    throw new AppError('VALIDATION_ERROR', 'Todo text is required');
  }

  const todo = {
    id: uuidv4(),
    text,
    completed: false,
    productId: productId || null,
    productName: productName || null,
    productPrice: productPrice || null,
    productImage: productImage || null,
    quantity: quantity || 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  await dataService.createTodo(req.user.userId, todo);

  res.status(201).json({
    success: true,
    data: todo
  });
}));

/**
 * @route PUT /api/todos/:todoId
 * @desc Update todo (toggle complete, update text, etc.)
 * @access Private
 */
router.put('/:todoId', authenticate, asyncHandler(async (req, res) => {
  const { todoId } = req.params;
  const updates = req.body;

  // Allow updating: text, completed, quantity
  const allowedUpdates = {};
  if (updates.text !== undefined) allowedUpdates.text = updates.text;
  if (updates.completed !== undefined) allowedUpdates.completed = updates.completed;
  if (updates.quantity !== undefined) allowedUpdates.quantity = updates.quantity;

  allowedUpdates.updatedAt = new Date().toISOString();

  const updatedTodo = await dataService.updateTodo(req.user.userId, todoId, allowedUpdates);

  if (!updatedTodo) {
    throw new AppError('NOT_FOUND', 'Todo not found');
  }

  res.json({
    success: true,
    data: updatedTodo
  });
}));

/**
 * @route DELETE /api/todos/:todoId
 * @desc Delete a todo
 * @access Private
 */
router.delete('/:todoId', authenticate, asyncHandler(async (req, res) => {
  const { todoId } = req.params;

  const deleted = await dataService.deleteTodo(req.user.userId, todoId);

  if (!deleted) {
    throw new AppError('NOT_FOUND', 'Todo not found');
  }

  res.json({
    success: true,
    message: 'Todo deleted successfully'
  });
}));

/**
 * @route POST /api/todos/bulk
 * @desc Sync todos (replace all todos for user)
 * @access Private
 */
router.post('/bulk', authenticate, asyncHandler(async (req, res) => {
  const { todos } = req.body;

  if (!Array.isArray(todos)) {
    throw new AppError('VALIDATION_ERROR', 'Todos must be an array');
  }

  // Ensure each todo has required fields
  const processedTodos = todos.map(todo => ({
    id: todo.id || uuidv4(),
    text: todo.text,
    completed: todo.completed || false,
    productId: todo.productId || null,
    productName: todo.productName || null,
    productPrice: todo.productPrice || null,
    productImage: todo.productImage || null,
    quantity: todo.quantity || 1,
    createdAt: todo.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));

  await dataService.saveTodos(req.user.userId, processedTodos);

  res.json({
    success: true,
    data: processedTodos
  });
}));

module.exports = router;
