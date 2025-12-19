// Error codes and their HTTP status/messages
const errorCodes = {
  INVALID_CREDENTIALS: { status: 401, message: 'Invalid username or password' },
  USERNAME_EXISTS: { status: 409, message: 'Username already taken' },
  EMAIL_EXISTS: { status: 409, message: 'Email already registered' },
  UNAUTHORIZED: { status: 401, message: 'Authentication required' },
  INVALID_TOKEN: { status: 401, message: 'Invalid or expired token' },
  NOT_FOUND: { status: 404, message: 'Resource not found' },
  VALIDATION_ERROR: { status: 400, message: 'Validation failed' },
  USER_NOT_FOUND: { status: 404, message: 'User not found' },
  PRODUCT_NOT_FOUND: { status: 404, message: 'Product not found' },
  CART_ITEM_NOT_FOUND: { status: 404, message: 'Cart item not found' }
};

// Custom error class
class AppError extends Error {
  constructor(code, details = null) {
    const errorInfo = errorCodes[code] || { status: 500, message: 'Internal server error' };
    super(errorInfo.message);
    this.code = code;
    this.status = errorInfo.status;
    this.details = details;
  }
}

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Handle AppError
  if (err instanceof AppError) {
    return res.status(err.status).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details
      }
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid token'
      }
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: {
        code: 'TOKEN_EXPIRED',
        message: 'Token has expired'
      }
    });
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: err.message
      }
    });
  }

  // Default error response
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred'
    }
  });
};

module.exports = errorHandler;
module.exports.AppError = AppError;
module.exports.errorCodes = errorCodes;
