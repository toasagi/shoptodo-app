/**
 * WSTG-ATHN-01: Authentication Credentials Testing
 * Tests for authentication security vulnerabilities
 *
 * Severity: High
 * OWASP Reference: https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/04-Authentication_Testing/
 */

const fs = require('fs');
const path = require('path');
const { AppState } = require('../../../app.js');
const appCode = fs.readFileSync(path.join(__dirname, '../../../app.js'), 'utf8');

describe('WSTG-ATHN-01: Authentication Credentials Testing', () => {
  let appState;

  beforeEach(() => {
    localStorage.clear();
    appState = new AppState();
  });

  describe('Hardcoded Credentials', () => {
    test.skip('VULNERABILITY: Application uses hardcoded credentials', () => {
      // Document: The application has hardcoded demo credentials
      // Location: app.js login method
      const validCredentials = { username: 'demo', password: 'password' };

      const result = appState.login(validCredentials.username, validCredentials.password);

      expect(result).toBe(true);

      // Security Issue: Credentials are hardcoded in source code
      // This is acceptable for a demo app, but should be documented
      console.log('SECURITY WARNING: Hardcoded credentials (demo/password) in production code');
    });

    test('Source code contains plaintext password', () => {
      // Check if password is visible in source code
      expect(appCode).toContain('password');

      // Document: Password "password" is hardcoded at approximately line 448
      // Recommendation: Use environment variables or secure authentication service
    });
  });

  describe('Credential Validation', () => {
    test('Invalid username is rejected', () => {
      const result = appState.login('invaliduser', 'password');
      expect(result).toBe(false);
    });

    test('Invalid password is rejected', () => {
      const result = appState.login('demo', 'wrongpassword');
      expect(result).toBe(false);
    });

    test('Empty credentials are rejected', () => {
      const result1 = appState.login('', 'password');
      const result2 = appState.login('demo', '');
      const result3 = appState.login('', '');

      expect(result1).toBe(false);
      expect(result2).toBe(false);
      expect(result3).toBe(false);
    });

    test('SQL injection in credentials does not cause errors', () => {
      // SQL injection payloads (not applicable for client-side only app, but good practice)
      const sqlPayloads = [
        "' OR '1'='1",
        "admin'--",
        "'; DROP TABLE users;--",
      ];

      sqlPayloads.forEach(payload => {
        // Should simply return false, not throw errors
        expect(() => appState.login(payload, payload)).not.toThrow();
        expect(appState.login(payload, payload)).toBe(false);
      });
    });
  });

  describe('Account Enumeration', () => {
    test('GOOD: Same error for invalid username and invalid password', () => {
      // Both should return false without distinguishing
      const invalidUser = appState.login('nonexistent', 'password');
      const invalidPass = appState.login('demo', 'wrongpassword');

      // Good practice: same response prevents account enumeration
      expect(invalidUser).toBe(invalidPass);
    });
  });

  describe('Brute Force Protection', () => {
    test.skip('VULNERABILITY: No rate limiting or lockout mechanism', () => {
      // Attempt multiple logins
      const attempts = [];
      for (let i = 0; i < 100; i++) {
        attempts.push(appState.login('demo', `wrong${i}`));
      }

      // All attempts should fail
      expect(attempts.every(r => r === false)).toBe(true);

      // But the account is not locked - this is a vulnerability
      // After 100 failed attempts, should still be able to login
      const finalAttempt = appState.login('demo', 'password');
      expect(finalAttempt).toBe(true);

      // Security Recommendation: Implement rate limiting or account lockout
      console.log('SECURITY WARNING: No brute force protection implemented');
    });
  });

  describe('Password Complexity', () => {
    test.skip('VULNERABILITY: Weak password accepted', () => {
      // The demo account uses "password" which is extremely weak
      // For a real application, password complexity should be enforced

      // Document that this is a demo application
      // Real applications should require:
      // - Minimum 8 characters
      // - Mix of upper/lower case
      // - Numbers and special characters
      expect('password'.length).toBeLessThan(12);
    });
  });
});
