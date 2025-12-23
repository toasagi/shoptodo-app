// AppState class unit tests

const { AppState } = require('../app.js');
const { createSampleProducts, createSampleCartItems, createSampleTodos, mockDateNow, setupLocalStorageWithData } = require('./testUtils.js');

describe('AppState', () => {
  let appState;

  beforeEach(() => {
    appState = new AppState();
  });

  describe('constructor and initialization', () => {
    test('should initialize with default values', () => {
      expect(appState.currentUser).toBeNull();
      expect(appState.cart).toEqual([]);
      expect(appState.todos).toEqual([]);
      expect(appState.orders).toEqual([]);
      expect(appState.currentLanguage).toBe('ja');
      expect(appState.products).toHaveLength(52);
      expect(appState.filteredProducts).toHaveLength(52);
    });

    test('should load data from localStorage', () => {
      const testData = {
        currentUser: { username: 'testuser' },
        cart: createSampleCartItems(),
        todos: createSampleTodos(),
        language: 'en'
      };

      setupLocalStorageWithData(testData);

      const newAppState = new AppState();
      expect(newAppState.currentUser).toEqual(testData.currentUser);
      expect(newAppState.cart).toEqual(testData.cart);
      expect(newAppState.todos).toEqual(testData.todos);
      expect(newAppState.currentLanguage).toBe('en');
    });
  });

  describe('authentication', () => {
    test('should login with correct credentials', () => {
      const result = appState.login('demo', 'Demo@2025!');

      expect(result).toBe(true);
      expect(appState.currentUser).toEqual({
        username: 'demo',
        profile: { displayName: '', phone: '', paymentMethod: '' }
      });
      expect(localStorage.setItem).toHaveBeenCalledWith('currentUser', JSON.stringify({
        username: 'demo',
        profile: { displayName: '', phone: '', paymentMethod: '' }
      }));
    });

    test('should reject login with incorrect username', () => {
      const result = appState.login('wronguser', 'password');

      expect(result).toBe(false);
      expect(appState.currentUser).toBeNull();
    });

    test('should reject login with incorrect password', () => {
      const result = appState.login('demo', 'wrongpassword');

      expect(result).toBe(false);
      expect(appState.currentUser).toBeNull();
    });

    test('should logout and clear data', () => {
      appState.currentUser = { username: 'demo' };
      appState.cart = createSampleCartItems();
      appState.todos = createSampleTodos();

      appState.logout();

      expect(appState.currentUser).toBeNull();
      expect(appState.cart).toEqual([]);
      expect(appState.todos).toEqual([]);
      expect(localStorage.removeItem).toHaveBeenCalledWith('currentUser');
      expect(localStorage.removeItem).toHaveBeenCalledWith('cart');
      expect(localStorage.removeItem).toHaveBeenCalledWith('todos');
    });
  });

  describe('cart management', () => {
    test('should add product to cart', () => {
      appState.addToCart(1);

      expect(appState.cart).toHaveLength(1);
      expect(appState.cart[0]).toMatchObject({
        id: 1,
        name: 'スマートフォン',
        price: 89800,
        quantity: 1
      });
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    test('should increase quantity when adding existing product', () => {
      appState.addToCart(1);
      appState.addToCart(1);

      expect(appState.cart).toHaveLength(1);
      expect(appState.cart[0].quantity).toBe(2);
    });

    test('should not add non-existent product', () => {
      appState.addToCart(999);

      expect(appState.cart).toHaveLength(0);
    });

    test('should remove product from cart', () => {
      appState.cart = createSampleCartItems();

      appState.removeFromCart(1);

      expect(appState.cart).toHaveLength(1);
      expect(appState.cart[0].id).toBe(2);
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    test('should update cart quantity', () => {
      appState.cart = createSampleCartItems();

      appState.updateCartQuantity(1, 5);

      expect(appState.cart[0].quantity).toBe(5);
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    test('should remove item when quantity becomes 0', () => {
      appState.cart = createSampleCartItems();

      appState.updateCartQuantity(1, 0);

      expect(appState.cart).toHaveLength(1);
      expect(appState.cart[0].id).toBe(2);
    });

    test('should calculate cart total correctly', () => {
      appState.cart = createSampleCartItems();

      const total = appState.getCartTotal();

      expect(total).toBe(4000); // (1000 * 2) + (2000 * 1)
    });

    test('should return 0 for empty cart total', () => {
      const total = appState.getCartTotal();

      expect(total).toBe(0);
    });
  });

  describe('todo management', () => {
    let restoreDateNow;

    beforeEach(() => {
      restoreDateNow = mockDateNow(1640995200000); // 2022-01-01 00:00:00
      // Also mock the new Date().toISOString() call
      global.Date = class extends Date {
        constructor(...args) {
          if (args.length === 0) {
            super(1640995200000); // Fixed timestamp
          } else {
            super(...args);
          }
        }

        static now() {
          return 1640995200000;
        }
      };
    });

    afterEach(() => {
      restoreDateNow();
      // Restore original Date
      global.Date = Date;
    });

    test('should add todo item', () => {
      appState.addTodo('Test todo');

      expect(appState.todos).toHaveLength(1);
      expect(appState.todos[0]).toMatchObject({
        id: 1640995200000,
        text: 'Test todo',
        completed: false,
        createdAt: '2022-01-01T00:00:00.000Z'
      });
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    test('should not add empty todo', () => {
      appState.addTodo('');
      appState.addTodo('   ');

      expect(appState.todos).toHaveLength(0);
    });

    test('should trim todo text', () => {
      appState.addTodo('  Test todo  ');

      expect(appState.todos[0].text).toBe('Test todo');
    });

    test('should toggle todo completion', () => {
      appState.todos = createSampleTodos();

      appState.toggleTodo(1);

      expect(appState.todos[0].completed).toBe(true);
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    test('should delete todo item', () => {
      appState.todos = createSampleTodos();

      appState.deleteTodo(1);

      expect(appState.todos).toHaveLength(1);
      expect(appState.todos[0].id).toBe(2);
      expect(localStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('product filtering', () => {
    test('should filter products by search term', () => {
      appState.filterProducts('スマート', '', 'name');

      expect(appState.filteredProducts).toHaveLength(2);
      expect(appState.filteredProducts.map(p => p.name)).toContain('スマートフォン');
      expect(appState.filteredProducts.map(p => p.name)).toContain('スマートウォッチ');
    });

    test('should filter products by category', () => {
      appState.filterProducts('', 'electronics', 'name');

      const electronicsProducts = appState.filteredProducts;
      expect(electronicsProducts.length).toBeGreaterThan(0);
      electronicsProducts.forEach(product => {
        expect(product.category).toBe('electronics');
      });
    });

    test('should sort products by name', () => {
      appState.filterProducts('', '', 'name');

      const productNames = appState.filteredProducts.map(p => p.name);
      const sortedNames = [...productNames].sort((a, b) => a.localeCompare(b));
      expect(productNames).toEqual(sortedNames);
    });

    test('should sort products by price (low to high)', () => {
      appState.filterProducts('', '', 'price-low');

      const prices = appState.filteredProducts.map(p => p.price);
      for (let i = 1; i < prices.length; i++) {
        expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
      }
    });

    test('should sort products by price (high to low)', () => {
      appState.filterProducts('', '', 'price-high');

      const prices = appState.filteredProducts.map(p => p.price);
      for (let i = 1; i < prices.length; i++) {
        expect(prices[i]).toBeLessThanOrEqual(prices[i - 1]);
      }
    });

    test('should combine search and category filters', () => {
      appState.filterProducts('ト', 'electronics', 'name');

      expect(appState.filteredProducts.length).toBeGreaterThan(0);
      appState.filteredProducts.forEach(product => {
        expect(product.name.includes('ト')).toBe(true);
        expect(product.category).toBe('electronics');
      });
    });
  });

  describe('language management', () => {
    test('should set language and save to storage', () => {
      appState.setLanguage('en');

      expect(appState.currentLanguage).toBe('en');
      expect(localStorage.setItem).toHaveBeenCalledWith('language', 'en');
    });

    test('should save all data to storage', () => {
      appState.currentUser = { username: 'test' };
      appState.cart = createSampleCartItems();
      appState.todos = createSampleTodos();
      appState.currentLanguage = 'en';

      appState.saveToStorage();

      expect(localStorage.setItem).toHaveBeenCalledWith('currentUser', JSON.stringify(appState.currentUser));
      expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify(appState.cart));
      expect(localStorage.setItem).toHaveBeenCalledWith('todos', JSON.stringify(appState.todos));
      expect(localStorage.setItem).toHaveBeenCalledWith('orders', JSON.stringify(appState.orders));
      expect(localStorage.setItem).toHaveBeenCalledWith('language', 'en');
    });
  });

  describe('order management', () => {
    let restoreDateNow;

    beforeEach(() => {
      restoreDateNow = mockDateNow(1640995200000);
      global.Date = class extends Date {
        constructor(...args) {
          if (args.length === 0) {
            super(1640995200000);
          } else {
            super(...args);
          }
        }

        static now() {
          return 1640995200000;
        }

        toISOString() {
          if (this.getTime() === 1640995200000) {
            return '2022-01-01T00:00:00.000Z';
          }
          return super.toISOString();
        }
      };
    });

    afterEach(() => {
      restoreDateNow();
      global.Date = Date;
    });

    test('should create order with cart items', () => {
      appState.cart = createSampleCartItems();
      const shippingInfo = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '090-1234-5678',
        postalCode: '100-0001',
        address: 'Tokyo, Japan'
      };
      const paymentMethod = 'credit_card';

      const order = appState.createOrder(shippingInfo, paymentMethod);

      expect(order).toBeDefined();
      expect(order.id).toBe(1640995200000);
      expect(order.date).toBe('2022-01-01T00:00:00.000Z');
      expect(order.items).toHaveLength(2);
      expect(order.total).toBe(4000);
      expect(order.shippingInfo).toEqual(shippingInfo);
      expect(order.paymentMethod).toBe('credit_card');
      expect(order.status).toBe('completed');
    });

    test('should clear cart after creating order', () => {
      appState.cart = createSampleCartItems();
      const shippingInfo = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '090-1234-5678',
        postalCode: '100-0001',
        address: 'Tokyo, Japan'
      };

      appState.createOrder(shippingInfo, 'credit_card');

      expect(appState.cart).toHaveLength(0);
    });

    test('should add order to orders array', () => {
      appState.cart = createSampleCartItems();
      const shippingInfo = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '090-1234-5678',
        postalCode: '100-0001',
        address: 'Tokyo, Japan'
      };

      appState.createOrder(shippingInfo, 'bank_transfer');

      expect(appState.orders).toHaveLength(1);
      expect(appState.orders[0].paymentMethod).toBe('bank_transfer');
    });

    test('should save order to localStorage', () => {
      appState.cart = createSampleCartItems();
      const shippingInfo = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '090-1234-5678',
        postalCode: '100-0001',
        address: 'Tokyo, Japan'
      };

      appState.createOrder(shippingInfo, 'cash_on_delivery');

      expect(localStorage.setItem).toHaveBeenCalledWith('orders', expect.any(String));
    });

    test('should load orders from localStorage', () => {
      const testOrders = [
        {
          id: 1640995200000,
          date: '2022-01-01T00:00:00.000Z',
          items: createSampleCartItems(),
          total: 4000,
          shippingInfo: {
            name: 'Test User',
            email: 'test@example.com',
            phone: '090-1234-5678',
            postalCode: '100-0001',
            address: 'Tokyo, Japan'
          },
          paymentMethod: 'credit_card',
          status: 'completed'
        }
      ];

      localStorage.setItem('orders', JSON.stringify(testOrders));

      const newAppState = new AppState();

      expect(newAppState.orders).toHaveLength(1);
      expect(newAppState.orders[0].id).toBe(1640995200000);
      expect(newAppState.orders[0].total).toBe(4000);
    });

    test('should preserve existing orders when creating new order', () => {
      appState.orders = [{
        id: 1640995100000,
        date: '2021-12-31T23:58:20.000Z',
        items: [],
        total: 1000,
        shippingInfo: {},
        paymentMethod: 'credit_card',
        status: 'completed'
      }];

      appState.cart = createSampleCartItems();
      const shippingInfo = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '090-1234-5678',
        postalCode: '100-0001',
        address: 'Tokyo, Japan'
      };

      appState.createOrder(shippingInfo, 'bank_transfer');

      expect(appState.orders).toHaveLength(2);
      expect(appState.orders[0].id).toBe(1640995100000);
      expect(appState.orders[1].id).toBe(1640995200000);
    });
  });
});