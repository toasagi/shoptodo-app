// Test utilities for ShopTodo unit tests

/**
 * Load the main application script for testing
 */
function loadApp() {
  // Since app.js uses global variables and DOM manipulation,
  // we need to load it in a way that makes classes available for testing
  require('../app.js');
}

/**
 * Create sample product data for testing
 */
function createSampleProducts() {
  return [
    { id: 1, name: 'Test Product 1', price: 1000, category: 'electronics', image: 'test1.jpg' },
    { id: 2, name: 'Test Product 2', price: 2000, category: 'clothing', image: 'test2.jpg' },
    { id: 3, name: 'Test Product 3', price: 3000, category: 'books', image: 'test3.jpg' },
  ];
}

/**
 * Create sample cart items for testing
 */
function createSampleCartItems() {
  return [
    { id: 1, name: 'Test Product 1', price: 1000, category: 'electronics', quantity: 2 },
    { id: 2, name: 'Test Product 2', price: 2000, category: 'clothing', quantity: 1 },
  ];
}

/**
 * Create sample todo items for testing
 */
function createSampleTodos() {
  return [
    { id: 1, text: 'Test todo 1', completed: false, createdAt: '2025-01-01T00:00:00.000Z' },
    { id: 2, text: 'Test todo 2', completed: true, createdAt: '2025-01-01T00:00:01.000Z' },
  ];
}

/**
 * Mock Date.now for consistent testing
 */
function mockDateNow(timestamp = 1640995200000) { // 2022-01-01 00:00:00
  const originalDateNow = Date.now;
  Date.now = jest.fn(() => timestamp);
  return () => {
    Date.now = originalDateNow;
  };
}

/**
 * Create a mock user object
 */
function createMockUser(username = 'testuser') {
  return { username };
}

/**
 * Set up localStorage with test data
 */
function setupLocalStorageWithData(data = {}) {
  const {
    currentUser = null,
    cart = [],
    todos = [],
    language = 'ja'
  } = data;

  if (currentUser) {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }
  if (cart.length > 0) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  if (todos.length > 0) {
    localStorage.setItem('todos', JSON.stringify(todos));
  }
  localStorage.setItem('language', language);
}

/**
 * Helper to create DOM elements for testing
 */
function createElement(tag, attributes = {}, children = []) {
  const element = document.createElement(tag);

  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else {
      element.setAttribute(key, value);
    }
  });

  children.forEach(child => {
    if (typeof child === 'string') {
      element.textContent = child;
    } else {
      element.appendChild(child);
    }
  });

  return element;
}

/**
 * Assert that an element has specific text content
 */
function expectElementToHaveText(element, expectedText) {
  expect(element.textContent.trim()).toBe(expectedText);
}

/**
 * Assert that an element has specific attribute
 */
function expectElementToHaveAttribute(element, attribute, expectedValue) {
  expect(element.getAttribute(attribute)).toBe(expectedValue);
}

module.exports = {
  loadApp,
  createSampleProducts,
  createSampleCartItems,
  createSampleTodos,
  mockDateNow,
  createMockUser,
  setupLocalStorageWithData,
  createElement,
  expectElementToHaveText,
  expectElementToHaveAttribute
};