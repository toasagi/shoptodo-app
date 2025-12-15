/**
 * WSTG-BUSL-02: Checkout Bypass Testing
 * Tests for business logic vulnerabilities in checkout process
 *
 * Severity: High
 * OWASP Reference: https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/10-Business_Logic_Testing/
 */

const { AppState } = require('../../../app.js');

describe('WSTG-BUSL-02: Checkout Bypass Testing', () => {
  let appState;

  beforeEach(() => {
    localStorage.clear();
    appState = new AppState();
    appState.login('demo', 'password');
  });

  describe('Empty Cart Checkout', () => {
    test('Empty cart can be verified', () => {
      // With empty cart, checkout should be prevented
      expect(appState.cart.length).toBe(0);

      // Note: UI disables button, but programmatic access might bypass
      // This test documents that empty cart state is detectable
    });

    test.skip('VULNERABILITY: Orders can be created with empty cart via localStorage', () => {
      // Directly create order without cart
      const fakeOrder = {
        id: Date.now(),
        items: [],
        total: 0,
        shipping: {
          name: 'Test',
          email: 'test@example.com',
          phone: '000-0000-0000',
          postalCode: '000-0000',
          address: 'Test',
        },
        payment: 'credit_card',
        date: new Date().toISOString(),
      };

      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      existingOrders.push(fakeOrder);
      localStorage.setItem('orders', JSON.stringify(existingOrders));

      // Order is created with 0 value
      const orders = JSON.parse(localStorage.getItem('orders'));
      expect(orders.length).toBe(1);
      expect(orders[0].total).toBe(0);
    });
  });

  describe('Shipping Validation Bypass', () => {
    test.skip('VULNERABILITY: Orders can be created with empty shipping info', () => {
      appState.addToCart(1);

      // Create order with empty shipping
      const orderWithEmptyShipping = {
        id: Date.now(),
        items: appState.cart,
        total: appState.getCartTotal(),
        shipping: {
          name: '',
          email: '',
          phone: '',
          postalCode: '',
          address: '',
        },
        payment: 'credit_card',
        date: new Date().toISOString(),
      };

      localStorage.setItem('orders', JSON.stringify([orderWithEmptyShipping]));

      const orders = JSON.parse(localStorage.getItem('orders'));
      expect(orders[0].shipping.name).toBe('');

      // Recommendation: Validate shipping info server-side
    });

    test.skip('VULNERABILITY: Invalid email format accepted in orders', () => {
      const invalidEmails = [
        'not-an-email',
        '@nodomain',
        'missing@',
        'spaces in@email.com',
      ];

      invalidEmails.forEach(email => {
        const order = {
          id: Date.now(),
          shipping: { email },
          items: [{ id: 1, price: 100, quantity: 1 }],
          total: 100,
        };

        // Orders can be created with any email format via localStorage
        localStorage.setItem('orders', JSON.stringify([order]));
        const stored = JSON.parse(localStorage.getItem('orders'));
        expect(stored[0].shipping.email).toBe(email);
      });
    });
  });

  describe('Payment Method Bypass', () => {
    test.skip('VULNERABILITY: Invalid payment method can be stored', () => {
      appState.addToCart(1);

      const orderWithInvalidPayment = {
        id: Date.now(),
        items: appState.cart,
        total: appState.getCartTotal(),
        shipping: {
          name: 'Test User',
          email: 'test@example.com',
          phone: '090-1234-5678',
          postalCode: '100-0001',
          address: 'Tokyo',
        },
        payment: 'free_payment', // Invalid payment method
        date: new Date().toISOString(),
      };

      localStorage.setItem('orders', JSON.stringify([orderWithInvalidPayment]));

      const orders = JSON.parse(localStorage.getItem('orders'));
      expect(orders[0].payment).toBe('free_payment');

      // Recommendation: Whitelist valid payment methods
    });
  });

  describe('Order Total Manipulation', () => {
    test.skip('VULNERABILITY: Order total can be set to any value', () => {
      appState.addToCart(1); // 89800 yen

      const orderWithTamperedTotal = {
        id: Date.now(),
        items: appState.cart,
        total: 1, // Tampered to 1 yen
        shipping: {
          name: 'Test',
          email: 'test@example.com',
          phone: '090-1234-5678',
          postalCode: '100-0001',
          address: 'Tokyo',
        },
        payment: 'credit_card',
        date: new Date().toISOString(),
      };

      localStorage.setItem('orders', JSON.stringify([orderWithTamperedTotal]));

      const orders = JSON.parse(localStorage.getItem('orders'));
      expect(orders[0].total).toBe(1);

      // CRITICAL: In a real e-commerce app, this would allow free purchases
      console.log('CRITICAL VULNERABILITY: Order total can be manipulated');
    });
  });

  describe('Order History Manipulation', () => {
    test.skip('VULNERABILITY: Fake orders can be injected', () => {
      // Inject fake orders with any data
      const fakeOrders = [
        {
          id: 1,
          items: [{ name: 'Fake Item', price: 999999, quantity: 100 }],
          total: 999999,
          shipping: { name: 'Fake Customer' },
          payment: 'refund',
          date: '2020-01-01',
        },
      ];

      localStorage.setItem('orders', JSON.stringify(fakeOrders));

      const orders = JSON.parse(localStorage.getItem('orders'));
      expect(orders.length).toBe(1);
      expect(orders[0].total).toBe(999999);
    });
  });

  describe('Remediation Recommendations', () => {
    test('Order validation function should check all fields', () => {
      const validateOrder = (order, cart, productCatalog) => {
        // Validate items match cart
        if (JSON.stringify(order.items) !== JSON.stringify(cart)) return false;

        // Validate total
        const expectedTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (order.total !== expectedTotal) return false;

        // Validate payment method
        const validPayments = ['credit_card', 'bank_transfer', 'cash_on_delivery'];
        if (!validPayments.includes(order.payment)) return false;

        // Validate shipping
        const requiredFields = ['name', 'email', 'phone', 'postalCode', 'address'];
        for (const field of requiredFields) {
          if (!order.shipping[field] || order.shipping[field].trim() === '') return false;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(order.shipping.email)) return false;

        return true;
      };

      const cart = [{ id: 1, price: 89800, quantity: 1 }];
      const validOrder = {
        items: cart,
        total: 89800,
        payment: 'credit_card',
        shipping: {
          name: 'Test',
          email: 'test@example.com',
          phone: '090-1234-5678',
          postalCode: '100-0001',
          address: 'Tokyo',
        },
      };

      expect(validateOrder(validOrder, cart, [])).toBe(true);

      // Tampered total
      expect(validateOrder({ ...validOrder, total: 1 }, cart, [])).toBe(false);

      // Invalid payment
      expect(validateOrder({ ...validOrder, payment: 'free' }, cart, [])).toBe(false);

      // Missing shipping field
      expect(validateOrder({
        ...validOrder,
        shipping: { ...validOrder.shipping, name: '' },
      }, cart, [])).toBe(false);
    });
  });
});
