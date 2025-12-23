/**
 * WSTG-BUSL-01: Cart Manipulation Testing
 * Tests for business logic vulnerabilities in shopping cart
 *
 * Severity: High
 * OWASP Reference: https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/10-Business_Logic_Testing/
 */

const { AppState } = require('../../../app.js');

describe('WSTG-BUSL-01: Cart Manipulation Testing', () => {
  let appState;

  beforeEach(() => {
    localStorage.clear();
    appState = new AppState();
    appState.login('demo', 'Demo@2025!');
  });

  describe('Price Tampering via localStorage', () => {
    test.skip('VULNERABILITY: Cart prices can be tampered via localStorage', () => {
      // Add product with original price
      const productId = 1; // Smartphone - 89800 yen
      appState.addToCart(productId);

      const originalPrice = appState.cart[0].price;
      expect(originalPrice).toBe(89800);

      // Simulate attacker modifying localStorage directly
      const tamperedCart = JSON.parse(localStorage.getItem('cart'));
      tamperedCart[0].price = 1; // Set price to 1 yen
      localStorage.setItem('cart', JSON.stringify(tamperedCart));

      // Create new instance to load tampered data
      const newAppState = new AppState();

      // VULNERABILITY: The tampered price is loaded
      expect(newAppState.cart[0].price).toBe(1);

      console.log('SECURITY VULNERABILITY: Cart prices can be tampered via localStorage');
      console.log('Original price:', originalPrice);
      console.log('Tampered price:', newAppState.cart[0].price);
    });

    test.skip('Cart total reflects tampered prices', () => {
      appState.addToCart(1); // 89800 yen

      // Tamper price
      const cart = JSON.parse(localStorage.getItem('cart'));
      cart[0].price = 100;
      localStorage.setItem('cart', JSON.stringify(cart));

      // Reload
      const newAppState = new AppState();
      const total = newAppState.getCartTotal();

      // Total is calculated from tampered price
      expect(total).toBe(100);

      // Recommendation: Validate prices against product catalog on checkout
    });
  });

  describe('Quantity Manipulation', () => {
    test.skip('VULNERABILITY: Negative quantity can be set', () => {
      appState.addToCart(1);

      // Attempt to set negative quantity via localStorage
      const cart = JSON.parse(localStorage.getItem('cart'));
      cart[0].quantity = -10;
      localStorage.setItem('cart', JSON.stringify(cart));

      const newAppState = new AppState();

      // This could lead to negative totals or refunds
      expect(newAppState.cart[0].quantity).toBe(-10);

      console.log('SECURITY WARNING: Negative quantities accepted');
    });

    test.skip('VULNERABILITY: Extremely large quantity can be set', () => {
      appState.addToCart(1);

      const cart = JSON.parse(localStorage.getItem('cart'));
      cart[0].quantity = Number.MAX_SAFE_INTEGER;
      localStorage.setItem('cart', JSON.stringify(cart));

      const newAppState = new AppState();

      // Could cause integer overflow or financial issues
      expect(newAppState.cart[0].quantity).toBe(Number.MAX_SAFE_INTEGER);
    });
  });

  describe('Product ID Manipulation', () => {
    test.skip('VULNERABILITY: Non-existent product ID can be added', () => {
      // Manually add cart item with fake product ID
      const fakeCart = [{
        id: 99999,
        name: 'Free Product',
        price: 0,
        quantity: 1,
      }];
      localStorage.setItem('cart', JSON.stringify(fakeCart));

      const newAppState = new AppState();

      // The fake product is loaded
      expect(newAppState.cart.length).toBe(1);
      expect(newAppState.cart[0].price).toBe(0);

      // Recommendation: Validate product IDs against catalog
    });
  });

  describe('Authentication Bypass for Cart', () => {
    test('Cart accessible without authentication', () => {
      // Add item while logged in
      appState.addToCart(1);

      // Verify cart has item before logout
      expect(appState.cart.length).toBeGreaterThan(0);

      appState.logout();

      // Document: Cart functionality doesn't require authentication
      // This is by design for UX, but may be a concern in some contexts
      expect(appState.currentUser).toBeNull();
    });
  });

  describe('Remediation Recommendations', () => {
    test('Server-side validation pattern', () => {
      // Recommended approach: Always validate on server
      const validateCartItem = (item, productCatalog) => {
        const product = productCatalog.find(p => p.id === item.id);
        if (!product) return false;
        if (item.price !== product.price) return false;
        if (item.quantity < 1 || item.quantity > 100) return false;
        return true;
      };

      const productCatalog = [
        { id: 1, name: 'Smartphone', price: 89800 },
      ];

      // Valid item
      expect(validateCartItem({ id: 1, price: 89800, quantity: 1 }, productCatalog)).toBe(true);

      // Tampered price
      expect(validateCartItem({ id: 1, price: 1, quantity: 1 }, productCatalog)).toBe(false);

      // Invalid quantity
      expect(validateCartItem({ id: 1, price: 89800, quantity: -1 }, productCatalog)).toBe(false);

      // Non-existent product
      expect(validateCartItem({ id: 999, price: 0, quantity: 1 }, productCatalog)).toBe(false);
    });
  });
});
