// Jest setup file for ShopTodo unit tests

// Mock localStorage
const localStorageMock = {
  store: {},
  getItem: jest.fn((key) => localStorageMock.store[key] || null),
  setItem: jest.fn((key, value) => {
    localStorageMock.store[key] = value.toString();
  }),
  removeItem: jest.fn((key) => {
    delete localStorageMock.store[key];
  }),
  clear: jest.fn(() => {
    localStorageMock.store = {};
  })
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock alert, confirm, and prompt
global.alert = jest.fn();
global.confirm = jest.fn(() => true);
global.prompt = jest.fn();

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
  log: jest.fn()
};

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  localStorageMock.clear();

  // Reset document body
  document.body.innerHTML = '';

  // Add minimal DOM structure that the app expects
  document.body.innerHTML = `
    <button id="lang-en" class="lang-btn">EN</button>
    <button id="lang-ja" class="lang-btn active">JP</button>
    <button id="login-btn">Login</button>
    <button id="logout-btn">Logout</button>
    <div class="close">&times;</div>
    <div id="login-modal"></div>
    <div id="user-info"></div>
    <span id="username"></span>
    <input id="search-input" />
    <select id="category-filter"></select>
    <select id="sort-select"></select>
    <button id="checkout-btn"></button>
    <button id="add-todo-btn">Add</button>
    <input id="todo-input" />
    <div id="products-grid"></div>
    <div id="cart-items"></div>
    <div id="cart-total"></div>
    <ul id="todo-list"></ul>
  `;
});