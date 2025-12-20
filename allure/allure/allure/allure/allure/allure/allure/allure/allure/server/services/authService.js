const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/config');
const dataService = require('./dataService');
const { AppError } = require('../middleware/errorHandler');

class AuthService {
  /**
   * Register a new user
   * @param {string} username - User's username
   * @param {string} email - User's email
   * @param {string} password - User's password (plain text)
   * @returns {Object} Created user (without password hash)
   */
  async register(username, email, password) {
    // Validate inputs
    if (!username || username.length < 3) {
      throw new AppError('VALIDATION_ERROR', 'Username must be at least 3 characters');
    }
    if (!email || !this.isValidEmail(email)) {
      throw new AppError('VALIDATION_ERROR', 'Invalid email format');
    }
    if (!password || password.length < 6) {
      throw new AppError('VALIDATION_ERROR', 'Password must be at least 6 characters');
    }

    // Check if username exists
    const existingUsername = await dataService.findUserByUsername(username);
    if (existingUsername) {
      throw new AppError('USERNAME_EXISTS');
    }

    // Check if email exists
    const existingEmail = await dataService.findUserByEmail(email);
    if (existingEmail) {
      throw new AppError('EMAIL_EXISTS');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, config.bcrypt.saltRounds);

    // Create user
    const user = {
      id: uuidv4(),
      username,
      email,
      passwordHash,
      profile: {
        displayName: '',
        phone: '',
        paymentMethod: ''
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await dataService.createUser(user);

    // Return user without password hash
    return this.sanitizeUser(user);
  }

  /**
   * Authenticate user and return JWT token
   * @param {string} username - User's username
   * @param {string} password - User's password (plain text)
   * @returns {Object} Token and user info
   */
  async login(username, password) {
    // Find user
    const user = await dataService.findUserByUsername(username);
    if (!user) {
      throw new AppError('INVALID_CREDENTIALS');
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new AppError('INVALID_CREDENTIALS');
    }

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    return {
      token,
      user: this.sanitizeUser(user)
    };
  }

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} True if valid
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Remove sensitive data from user object
   * @param {Object} user - User object
   * @returns {Object} User without sensitive data
   */
  sanitizeUser(user) {
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }
}

module.exports = new AuthService();
