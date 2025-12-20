const request = require('supertest');
const app = require('../index');

// Test user credentials (must meet password requirements: 10+ chars, letters, numbers, symbols)
const testUser = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'Test@pass123'
};

const testUser2 = {
  username: 'testuser2',
  email: 'test2@example.com',
  password: 'Test@pass456'
};

// Register a test user and return the response
async function registerUser(userData = testUser) {
  return request(app)
    .post('/api/auth/register')
    .send(userData);
}

// Login a test user and return the token
async function loginUser(credentials = { username: testUser.username, password: testUser.password }) {
  const res = await request(app)
    .post('/api/auth/login')
    .send(credentials);
  return res.body.data?.token;
}

// Register and login a user, return the token
async function createAuthenticatedUser(userData = testUser) {
  await registerUser(userData);
  return loginUser({ username: userData.username, password: userData.password });
}

// Create an authenticated request with token
function authRequest(method, path, token) {
  return request(app)
    [method](path)
    .set('Authorization', `Bearer ${token}`);
}

// Test product data
const testProduct = {
  productId: 'prod-1',
  name: 'Test Product',
  price: 1000,
  quantity: 1,
  image: 'test.jpg'
};

const testProduct2 = {
  productId: 'prod-2',
  name: 'Test Product 2',
  price: 2000,
  quantity: 2,
  image: 'test2.jpg'
};

// Test todo data
const testTodo = {
  text: 'Test todo item',
  productId: 'prod-1',
  productName: 'Test Product',
  productPrice: 1000,
  quantity: 1
};

module.exports = {
  app,
  request,
  testUser,
  testUser2,
  testProduct,
  testProduct2,
  testTodo,
  registerUser,
  loginUser,
  createAuthenticatedUser,
  authRequest
};
