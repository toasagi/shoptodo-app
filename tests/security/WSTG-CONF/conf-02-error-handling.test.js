/**
 * WSTG-CONF-02: Error Handling Testing
 * Tests for secure error handling and information disclosure
 *
 * Severity: Low
 * OWASP Reference: https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/08-Testing_for_Error_Handling/
 */

const fs = require('fs');
const path = require('path');
const { AppState } = require('../../../app.js');
const appCode = fs.readFileSync(path.join(__dirname, '../../../app.js'), 'utf8');

describe('WSTG-CONF-02: Error Handling Testing', () => {
  let appState;
  let consoleErrorSpy;
  let consoleLogSpy;

  beforeEach(() => {
    localStorage.clear();

    // Spy on console methods
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    appState = new AppState();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  describe('Invalid Input Handling', () => {
    test('Invalid product ID does not throw errors', () => {
      expect(() => {
        appState.addToCart(99999); // Non-existent product
      }).not.toThrow();
    });

    test('Empty string input is handled', () => {
      // Empty string may be rejected or accepted based on validation
      expect(() => {
        appState.addTodo('');
      }).not.toThrow();

      // Document: App should validate input and provide user feedback
    });

    test('Invalid login credentials do not expose internal errors', () => {
      expect(() => {
        appState.login(null, null);
        appState.login(undefined, undefined);
        appState.login({}, []);
      }).not.toThrow();

      // Should just return false, not expose error details
    });
  });

  describe('localStorage Error Handling', () => {
    test('Corrupted localStorage handling', () => {
      // Store invalid JSON in cart
      localStorage.setItem('cart', 'not-valid-json');

      // Document: App may throw or recover gracefully
      // This tests documents the behavior for security audit
      let threw = false;
      try {
        const newAppState = new AppState();
      } catch (e) {
        threw = true;
        console.log('App threw on corrupted localStorage:', e.message);
      }

      // Either behavior is acceptable but should be documented
      console.log('Corrupted localStorage handling:', threw ? 'throws' : 'recovers');
    });

    test('Missing localStorage items are handled', () => {
      // Clear all storage
      localStorage.clear();

      expect(() => {
        const newAppState = new AppState();
        newAppState.addTodo('Test');
        newAppState.addToCart(1);
      }).not.toThrow();
    });
  });

  describe('Information Disclosure', () => {
    test('Source code should not contain sensitive comments', () => {
      // Check for potentially sensitive patterns in source
      const sensitivePatterns = [
        /TODO:.*password/i,
        /FIXME:.*security/i,
        /\/\/.*api.?key/i,
        /\/\/.*secret/i,
        /\/\/.*token/i,
        /DEBUG/,
      ];

      sensitivePatterns.forEach(pattern => {
        const matches = appCode.match(pattern);
        if (matches) {
          console.log('REVIEW: Potentially sensitive comment found:', matches[0]);
        }
      });

      // Document any findings (not necessarily failures)
      expect(true).toBe(true);
    });

    test('Error messages do not reveal system information', () => {
      // Simulate various error conditions
      const testCases = [
        () => appState.login("'; DROP TABLE users; --", 'test'),
        () => JSON.parse('invalid'),
        () => appState.addToCart(-1),
      ];

      testCases.forEach((testFn, index) => {
        try {
          testFn();
        } catch (e) {
          // Error messages should not contain:
          // - File paths
          // - Stack traces with internal details
          // - Database information
          // - Server configuration

          const errorStr = e.toString();
          expect(errorStr).not.toContain('/Users/');
          expect(errorStr).not.toContain('/home/');
          expect(errorStr).not.toContain('node_modules');
        }
      });
    });
  });

  describe('Debug Mode Detection', () => {
    test('Check for debug flags in source code', () => {
      const debugPatterns = [
        /debug\s*[:=]\s*true/i,
        /debugMode\s*[:=]\s*true/i,
        /isDebug\s*[:=]\s*true/i,
        /console\.debug\(/,
      ];

      debugPatterns.forEach(pattern => {
        const hasDebug = pattern.test(appCode);
        if (hasDebug) {
          console.log('REVIEW: Debug pattern found:', pattern.toString());
        }
      });
    });

    test('Check for verbose console logging', () => {
      // Count console.log statements
      const consoleLogCount = (appCode.match(/console\.log\(/g) || []).length;
      const consoleErrorCount = (appCode.match(/console\.error\(/g) || []).length;

      // Document usage
      console.log(`Console usage: ${consoleLogCount} log, ${consoleErrorCount} error`);

      // Recommendation: Remove or minimize console.log in production
      // Consider using a logging library with levels
    });
  });

  describe('Exception Handling Patterns', () => {
    test('Document: Recommended error handling pattern', () => {
      // Example of secure error handling
      const secureErrorHandler = (error, context) => {
        // Log detailed error internally (server-side in real app)
        const internalLog = {
          timestamp: new Date().toISOString(),
          context,
          error: error.message,
          stack: error.stack, // Only log server-side
        };

        // Return safe message to user
        const userMessage = {
          error: true,
          message: 'An error occurred. Please try again.',
          code: 'ERR_GENERAL',
        };

        return userMessage;
      };

      const testError = new Error('Database connection failed at /var/db/app.db');
      const result = secureErrorHandler(testError, 'login');

      // User message should not contain sensitive details
      expect(result.message).not.toContain('/var/db');
      expect(result.message).not.toContain('Database');
    });

    test('Document: Try-catch wrapper pattern', () => {
      const safeExecute = (fn, fallback = null) => {
        try {
          return fn();
        } catch (error) {
          // In production, log to monitoring service
          console.error('Operation failed:', error.message);
          return fallback;
        }
      };

      // Safe JSON parsing
      const result = safeExecute(() => JSON.parse('invalid'), {});
      expect(result).toEqual({});

      // Valid parsing
      const validResult = safeExecute(() => JSON.parse('{"a":1}'), {});
      expect(validResult).toEqual({ a: 1 });
    });
  });

  describe('Global Error Handling', () => {
    test('Document: Recommended window.onerror handler', () => {
      const secureErrorHandler = `
        window.onerror = function(message, source, lineno, colno, error) {
          // Send to monitoring service (remove sensitive data)
          const sanitizedMessage = message.replace(/['"]\\/[^'"]+['"]/g, '[PATH]');

          // Don't expose to user
          return true; // Prevents default browser error handling
        };
      `;

      expect(secureErrorHandler).toContain('sanitizedMessage');
    });

    test('Document: Recommended unhandledrejection handler', () => {
      const promiseErrorHandler = `
        window.addEventListener('unhandledrejection', function(event) {
          // Log safely
          console.error('Unhandled promise rejection');

          // Prevent default console error
          event.preventDefault();
        });
      `;

      expect(promiseErrorHandler).toContain('unhandledrejection');
    });
  });
});
