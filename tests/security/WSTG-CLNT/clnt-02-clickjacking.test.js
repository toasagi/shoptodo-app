/**
 * WSTG-CLNT-02: Clickjacking Testing
 * Tests for clickjacking (UI redressing) vulnerabilities
 *
 * Severity: Medium
 * OWASP Reference: https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/11-Client-side_Testing/09-Testing_for_Clickjacking
 */

const fs = require('fs');
const path = require('path');

describe('WSTG-CLNT-02: Clickjacking Testing', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <button id="lang-en" class="lang-btn">EN</button>
      <button id="lang-ja" class="lang-btn active">JP</button>
      <button id="login-btn">Login</button>
      <button id="logout-btn" style="display:none">Logout</button>
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

  describe('Frame Protection Headers', () => {
    test('FIXED: index.html has clickjacking protection', () => {
      // Read index.html to check for frame busting
      const indexPath = path.join(__dirname, '../../../index.html');
      const indexHtml = fs.readFileSync(indexPath, 'utf8');

      // Check for meta tag frame protection (CSP frame-ancestors)
      const hasFrameAncestors = indexHtml.includes('frame-ancestors');

      // Check for JavaScript frame busting code
      const hasFrameBusting = indexHtml.includes('top.location') ||
                              indexHtml.includes('self !== top') ||
                              indexHtml.includes('window.top');

      // Verify that protection is in place
      expect(hasFrameAncestors).toBe(true);
      expect(hasFrameBusting).toBe(true);

      console.log('SECURITY: Clickjacking protection detected');
      console.log('- CSP frame-ancestors: ' + hasFrameAncestors);
      console.log('- JavaScript frame-busting: ' + hasFrameBusting);
    });

    test('FIXED: user-profile.html has clickjacking protection', () => {
      // Read user-profile.html to check for frame busting
      const profilePath = path.join(__dirname, '../../../user-profile.html');
      const profileHtml = fs.readFileSync(profilePath, 'utf8');

      // Check for meta tag frame protection (CSP frame-ancestors)
      const hasFrameAncestors = profileHtml.includes('frame-ancestors');

      // Check for JavaScript frame busting code
      const hasFrameBusting = profileHtml.includes('top.location') ||
                              profileHtml.includes('self !== top') ||
                              profileHtml.includes('window.top');

      // Verify that protection is in place
      expect(hasFrameAncestors).toBe(true);
      expect(hasFrameBusting).toBe(true);
    });
  });

  describe('Sensitive Actions Vulnerable to Clickjacking', () => {
    test('Login button could be clickjacked', () => {
      const loginBtn = document.getElementById('login-btn');

      // Login button exists and could be targeted
      expect(loginBtn).not.toBeNull();

      // Without frame protection, attacker could overlay invisible frame
      // and trick user into clicking login button

      // Recommendation: Add frame-busting or X-Frame-Options
    });

    test('Checkout button could be clickjacked', () => {
      const checkoutBtn = document.getElementById('checkout-btn');

      // Checkout action is sensitive
      expect(checkoutBtn).not.toBeNull();

      // Attacker could trick user into completing purchase
      // by overlaying malicious content on iframe
    });

    test('Add to cart buttons could be clickjacked', () => {
      // Products grid will have add-to-cart buttons
      const productsGrid = document.getElementById('products-grid');

      expect(productsGrid).not.toBeNull();

      // Without protection, attacker could make user
      // unknowingly add items to cart
    });
  });

  describe('Remediation Patterns', () => {
    test('Example: JavaScript frame busting code', () => {
      // Classic frame busting (can be bypassed)
      const classicFrameBusting = `
        if (top !== self) {
          top.location = self.location;
        }
      `;

      // Modern frame busting with sandbox bypass protection
      const modernFrameBusting = `
        if (self !== top) {
          try {
            if (top.location.hostname !== self.location.hostname) {
              top.location.replace(self.location.href);
            }
          } catch (e) {
            // Cross-origin, redirect anyway
            top.location.replace(self.location.href);
          }
        }
      `;

      // Verify patterns are valid JavaScript
      expect(() => {
        // Don't actually run, just verify syntax
        new Function(classicFrameBusting);
        new Function(modernFrameBusting);
      }).not.toThrow();
    });

    test('Example: CSP frame-ancestors meta tag', () => {
      // Best practice: Use Content-Security-Policy header
      // But meta tag can also be used
      const cspMetaTag = `<meta http-equiv="Content-Security-Policy" content="frame-ancestors 'self'">`;

      expect(cspMetaTag).toContain('frame-ancestors');

      // 'self' - only allow framing from same origin
      // 'none' - don't allow framing at all
    });

    test('Example: Detecting if page is framed', () => {
      const isFramed = () => {
        try {
          return window.self !== window.top;
        } catch (e) {
          // Cross-origin frame - definitely framed
          return true;
        }
      };

      // In jsdom, we're not framed
      expect(isFramed()).toBe(false);
    });

    test('Example: Visual frame detection warning', () => {
      // Show warning if framed
      const showFrameWarning = () => {
        try {
          if (window.self !== window.top) {
            document.body.innerHTML = `
              <div style="background: red; color: white; padding: 20px; text-align: center;">
                <h1>Security Warning</h1>
                <p>This page appears to be loaded in a frame.</p>
                <p>Please access directly: ${window.location.href}</p>
              </div>
            `;
            return true;
          }
        } catch (e) {
          // Cross-origin frame
          return true;
        }
        return false;
      };

      // Function should work without errors
      expect(() => showFrameWarning()).not.toThrow();
    });
  });

  describe('Server-Side Recommendations', () => {
    test('Document: HTTP headers for clickjacking protection', () => {
      // These headers should be set by the server
      const recommendedHeaders = {
        'X-Frame-Options': 'DENY', // or 'SAMEORIGIN'
        'Content-Security-Policy': "frame-ancestors 'none'", // or "'self'"
      };

      // X-Frame-Options values:
      // DENY - page cannot be displayed in a frame
      // SAMEORIGIN - page can only be displayed in frame on same origin
      // ALLOW-FROM uri - deprecated, use CSP instead

      // CSP frame-ancestors values:
      // 'none' - equivalent to X-Frame-Options: DENY
      // 'self' - equivalent to X-Frame-Options: SAMEORIGIN
      // 'https://example.com' - allow specific origins

      expect(recommendedHeaders['X-Frame-Options']).toBe('DENY');
      expect(recommendedHeaders['Content-Security-Policy']).toContain('frame-ancestors');
    });
  });
});
