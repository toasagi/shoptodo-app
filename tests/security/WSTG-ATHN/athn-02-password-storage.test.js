/**
 * WSTG-ATHN-02: Password Storage Testing
 * Tests for secure password storage practices
 *
 * Severity: High
 * OWASP Reference: https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/04-Authentication_Testing/09-Testing_for_Weak_Password_Policy
 */

const { dumpLocalStorage, findSensitiveDataPatterns } = require('../utils/security-test-helpers');
const { AppState } = require('../../../app.js');

describe('WSTG-ATHN-02: Password Storage Testing', () => {
  let appState;

  beforeEach(() => {
    localStorage.clear();
    appState = new AppState();
  });

  describe('Password in localStorage', () => {
    test('GOOD: Password is NOT stored in localStorage after login', () => {
      appState.login('demo', 'Demo@2025!');

      const stored = dumpLocalStorage();

      // Check that password is not stored anywhere
      const storageString = JSON.stringify(stored);
      expect(storageString.toLowerCase()).not.toContain('"password"');

      // Good practice: Only username is stored, not password
    });

    test('currentUser storage does not contain password', () => {
      appState.login('demo', 'Demo@2025!');

      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        expect(currentUser.toLowerCase()).not.toContain('password');
      }
    });
  });

  describe('Sensitive Data in localStorage', () => {
    test.skip('VULNERABILITY: PII can be stored in plaintext localStorage', () => {
      appState.login('demo', 'Demo@2025!');

      // Simulate order with PII
      appState.addToCart(1);

      // Create order with shipping info (simulated)
      const orderWithPII = {
        id: Date.now(),
        shipping: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '090-1234-5678',
          postalCode: '100-0001',
          address: 'Tokyo, Chiyoda 1-1',
        },
        items: appState.cart,
        total: 89800,
      };

      // Store order (simulating app behavior)
      localStorage.setItem('orders', JSON.stringify([orderWithPII]));

      // Verify PII is stored in plaintext
      const ordersStr = localStorage.getItem('orders');
      expect(ordersStr).toContain('john@example.com');
      expect(ordersStr).toContain('090-1234-5678');
      expect(ordersStr).toContain('100-0001');

      console.log('SECURITY WARNING: PII stored in plaintext localStorage');
    });

    test('localStorage is accessible via JavaScript', () => {
      appState.login('demo', 'Demo@2025!');
      appState.addTodo('Secret note');

      // Any JavaScript can read localStorage
      // If XSS occurs, all data is compromised
      const allData = dumpLocalStorage();

      // Verify data is accessible
      expect(allData.currentUser).not.toBeNull();

      // Security Recommendation:
      // - Minimize sensitive data in localStorage
      // - Consider session storage for temporary data
      // - Encrypt sensitive data if it must be stored
    });
  });

  describe('Session Token Security', () => {
    test.skip('VULNERABILITY: No session token - relies on localStorage flag', () => {
      appState.login('demo', 'Demo@2025!');

      // The app uses localStorage to track login state
      // There's no secure session token
      const currentUser = localStorage.getItem('currentUser');

      // An attacker could simply set this value to bypass authentication
      localStorage.setItem('currentUser', 'demo');

      // Recommendation: Use secure session tokens with HttpOnly cookies
      console.log('SECURITY WARNING: Authentication relies on localStorage, not secure tokens');
    });

    test('Session can be hijacked by modifying localStorage', () => {
      // Simulate session hijacking
      localStorage.setItem('currentUser', JSON.stringify({ username: 'admin' }));

      const newInstance = new AppState();

      // The new instance thinks 'admin' is logged in
      expect(newInstance.currentUser.username).toBe('admin');

      // Security Issue: No server-side validation of session
    });
  });

  describe('Logout Security', () => {
    test('GOOD: Logout clears currentUser', () => {
      appState.login('demo', 'Demo@2025!');
      expect(appState.currentUser.username).toBe('demo');

      appState.logout();

      expect(appState.currentUser).toBeNull();
      expect(localStorage.getItem('currentUser')).toBeNull();
    });

    test('Data may persist after logout (by design)', () => {
      appState.login('demo', 'Demo@2025!');
      appState.addTodo('Test todo');

      // Verify todo was added
      expect(appState.todos.length).toBeGreaterThan(0);

      appState.logout();

      // Document: Session is cleared
      expect(appState.currentUser).toBeNull();

      // For shared computers, data persistence could be a privacy concern
      console.log('NOTE: Review app behavior - user data may persist in localStorage after logout');
    });
  });
});
