/**
 * WSTG-CLNT-01: localStorage Security Testing
 * Tests for client-side storage security vulnerabilities
 *
 * Severity: High
 * OWASP Reference: https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/11-Client-side_Testing/12-Testing_Browser_Storage
 */

const { dumpLocalStorage, findSensitiveDataPatterns } = require('../utils/security-test-helpers');
const { AppState } = require('../../../app.js');

describe('WSTG-CLNT-01: localStorage Security Testing', () => {
  let appState;

  beforeEach(() => {
    localStorage.clear();
    appState = new AppState();
  });

  describe('Data Persistence Risks', () => {
    test.skip('VULNERABILITY: All data stored in localStorage persists indefinitely', () => {
      appState.login('demo', 'Demo@2025!');
      appState.addTodo('Sensitive task');
      appState.addToCart(1);

      // Verify data exists in localStorage
      expect(localStorage.getItem('currentUser')).not.toBeNull();

      // localStorage has no expiration
      // Recommendation: Use sessionStorage for sensitive data
      // or implement expiration mechanism
    });

    test('Data persists across browser sessions', () => {
      appState.login('demo', 'Demo@2025!');
      appState.addTodo('Remember this');

      // Simulate new session by creating new AppState
      const newAppState = new AppState();

      // Data is still available (currentUser is an object)
      expect(newAppState.todos.length).toBe(1);
      expect(newAppState.currentUser.username).toBe('demo');

      // Security Consideration: On shared computers, this is a risk
    });
  });

  describe('Data Tampering Risks', () => {
    test.skip('VULNERABILITY: Any JavaScript can modify localStorage', () => {
      appState.login('demo', 'Demo@2025!');

      // Simulate malicious script modifying data
      localStorage.setItem('currentUser', JSON.stringify({ username: 'admin' }));

      // New instance reads tampered data
      const newAppState = new AppState();
      expect(newAppState.currentUser.username).toBe('admin');

      // No integrity checks on localStorage data
    });

    test.skip('VULNERABILITY: localStorage data is not encrypted', () => {
      appState.login('demo', 'Demo@2025!');
      appState.addTodo('Secret information');

      // Verify data is stored in plaintext
      const todosStr = localStorage.getItem('todos');
      const currentUserStr = localStorage.getItem('currentUser');

      // All data is readable in plaintext
      expect(todosStr).toContain('Secret information');
      expect(currentUserStr).toContain('demo');

      // Recommendation: Encrypt sensitive data before storage
    });

    test('Invalid JSON in localStorage handling', () => {
      // Store invalid JSON
      localStorage.setItem('cart', 'not-valid-json');

      // Document: App may throw or recover on invalid JSON
      // This documents the behavior for security audit
      let handledGracefully = false;
      try {
        const newAppState = new AppState();
        handledGracefully = true;
      } catch (e) {
        // App throws on corrupted data - this is acceptable but documented
        console.log('App throws on corrupted localStorage:', e.message);
      }

      // Document the behavior
      console.log('Invalid JSON handling:', handledGracefully ? 'recovers' : 'throws');
    });
  });

  describe('Cross-Tab Communication Risks', () => {
    test('localStorage changes affect all tabs', () => {
      appState.login('demo', 'Demo@2025!');

      // Changes in one "tab" (instance) affect others
      // because they share localStorage

      const otherTab = new AppState();
      expect(otherTab.currentUser.username).toBe('demo');

      // This is expected behavior but can be exploited
      // if attacker has XSS in any tab
    });
  });

  describe('Sensitive Data Exposure', () => {
    test.skip('VULNERABILITY: User preferences stored without protection', () => {
      appState.login('demo', 'Demo@2025!');
      localStorage.setItem('language', 'ja');

      // Verify data is stored and accessible
      expect(localStorage.getItem('language')).toBe('ja');
      expect(localStorage.getItem('currentUser')).not.toBeNull();
    });

    test.skip('VULNERABILITY: Order history with PII can be stored', () => {
      const orderWithPII = {
        id: Date.now(),
        shipping: {
          name: 'Taro Yamada',
          email: 'taro@example.com',
          phone: '090-1234-5678',
          postalCode: '100-0001',
          address: 'Tokyo, Chiyoda-ku 1-1-1',
        },
        items: [{ id: 1, name: 'Product', price: 1000, quantity: 1 }],
        total: 1000,
        payment: 'credit_card',
        date: new Date().toISOString(),
      };

      localStorage.setItem('orders', JSON.stringify([orderWithPII]));

      // Verify PII is stored in plaintext
      const ordersString = localStorage.getItem('orders');
      expect(ordersString).toContain('taro@example.com');
      expect(ordersString).toContain('090-1234-5678');

      console.log('SECURITY WARNING: PII can be stored in plaintext localStorage');
    });
  });

  describe('Storage Quota and DoS', () => {
    test('Large data can be stored (potential DoS vector)', () => {
      // localStorage typically has 5-10MB limit
      // Attackers could fill it to cause issues

      const largeData = 'x'.repeat(1000); // 1KB
      localStorage.setItem('test', largeData);

      expect(localStorage.getItem('test').length).toBe(1000);

      // Cleanup
      localStorage.removeItem('test');
    });
  });

  describe('Remediation Recommendations', () => {
    test('Example: Data integrity check pattern', () => {
      const createSecureStorage = () => {
        const secretKey = 'app-secret'; // In real app, use proper key

        // Simple checksum (use proper HMAC in production)
        const calculateChecksum = (data) => {
          let hash = 0;
          const str = JSON.stringify(data) + secretKey;
          for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0;
          }
          return hash.toString(16);
        };

        return {
          setItem: (key, value) => {
            const checksum = calculateChecksum(value);
            localStorage.setItem(key, JSON.stringify({ data: value, checksum }));
          },
          getItem: (key) => {
            const stored = localStorage.getItem(key);
            if (!stored) return null;
            const { data, checksum } = JSON.parse(stored);
            if (calculateChecksum(data) !== checksum) {
              console.warn('Data integrity check failed');
              return null;
            }
            return data;
          },
        };
      };

      const secureStorage = createSecureStorage();
      secureStorage.setItem('test', { value: 'sensitive' });

      // Valid data
      expect(secureStorage.getItem('test')).toEqual({ value: 'sensitive' });

      // Tampered data
      const stored = JSON.parse(localStorage.getItem('test'));
      stored.data.value = 'tampered';
      localStorage.setItem('test', JSON.stringify(stored));

      // Should detect tampering
      expect(secureStorage.getItem('test')).toBeNull();
    });

    test('Example: Session-based storage pattern', () => {
      // Use sessionStorage for sensitive temporary data
      sessionStorage.setItem('tempToken', 'abc123');

      expect(sessionStorage.getItem('tempToken')).toBe('abc123');

      // sessionStorage is cleared when tab closes
      // Better for sensitive session data

      sessionStorage.clear();
    });
  });
});
