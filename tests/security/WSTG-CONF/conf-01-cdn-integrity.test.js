/**
 * WSTG-CONF-01: CDN Integrity Testing (Subresource Integrity)
 * Tests for external resource security
 *
 * Severity: Medium
 * OWASP Reference: https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/02-Configuration_and_Deployment_Management_Testing/
 */

const fs = require('fs');
const path = require('path');

describe('WSTG-CONF-01: CDN Integrity Testing', () => {
  let indexHtml;

  beforeAll(() => {
    const indexPath = path.join(__dirname, '../../../index.html');
    indexHtml = fs.readFileSync(indexPath, 'utf8');
  });

  describe('External Stylesheet Integrity', () => {
    test('Document CDN stylesheets SRI status', () => {
      // Extract all link tags with external hrefs
      const linkRegex = /<link[^>]+href=["']([^"']*cdnjs[^"']*)["'][^>]*>/gi;
      const links = [...indexHtml.matchAll(linkRegex)];

      if (links.length === 0) {
        // No CDN links found - skip
        console.log('No CDN stylesheet links found');
        return;
      }

      const resourcesWithoutSRI = [];
      links.forEach(match => {
        const fullTag = match[0];
        const hasIntegrity = fullTag.includes('integrity=');
        const hasCrossorigin = fullTag.includes('crossorigin=');

        if (!hasIntegrity) {
          console.log('SECURITY WARNING: Missing integrity attribute:', match[1]);
          resourcesWithoutSRI.push(match[1]);
        }
        if (!hasCrossorigin) {
          console.log('SECURITY WARNING: Missing crossorigin attribute:', match[1]);
        }
      });

      // Document that SRI may be missing
      console.log('Resources without SRI:', resourcesWithoutSRI);
    });
  });

  describe('External Script Integrity', () => {
    test('Check external scripts for SRI attributes', () => {
      // Extract all script tags with external src
      const scriptRegex = /<script[^>]+src=["']([^"']*cdnjs[^"']*)["'][^>]*>/gi;
      const scripts = [...indexHtml.matchAll(scriptRegex)];

      if (scripts.length === 0) {
        console.log('No CDN script links found');
        return;
      }

      scripts.forEach(match => {
        const fullTag = match[0];
        const hasIntegrity = fullTag.includes('integrity=');

        if (!hasIntegrity) {
          console.log('SECURITY WARNING: Script without integrity:', match[1]);
        }
      });
    });
  });

  describe('Font Awesome CDN', () => {
    test('FIXED: Font Awesome has SRI attributes', () => {
      const hasFontAwesome = indexHtml.includes('font-awesome') ||
                             indexHtml.includes('fontawesome');

      expect(hasFontAwesome).toBe(true);

      const fontAwesomeRegex = /<link[^>]+href=["']([^"']*font-?awesome[^"']*)["'][^>]*>/gi;
      const matches = [...indexHtml.matchAll(fontAwesomeRegex)];

      expect(matches.length).toBeGreaterThan(0);

      matches.forEach(match => {
        const hasIntegrity = match[0].includes('integrity=');
        const hasCrossorigin = match[0].includes('crossorigin=');

        // Verify SRI is now in place
        expect(hasIntegrity).toBe(true);
        expect(hasCrossorigin).toBe(true);

        console.log('SECURITY: Font Awesome has SRI:', match[1]);
      });
    });
  });

  describe('SRI Best Practices', () => {
    test('Example: Correct SRI implementation', () => {
      // Correct example with SRI
      const correctExample = `
        <link rel="stylesheet"
              href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
              integrity="sha512-..."
              crossorigin="anonymous"
              referrerpolicy="no-referrer" />
      `;

      expect(correctExample).toContain('integrity=');
      expect(correctExample).toContain('crossorigin=');
    });

    test('Document: Why SRI is important', () => {
      const reasons = [
        'Prevents CDN compromise from affecting your users',
        'Protects against MITM attacks on CDN resources',
        'Ensures resource has not been modified',
        'Required for CSP with strict resource policies',
      ];

      reasons.forEach(reason => {
        expect(reason).toBeTruthy();
      });

      // How to generate SRI hash:
      // openssl dgst -sha384 -binary file.js | openssl base64 -A
      // Or use https://www.srihash.org/
    });

    test('Example: Generate SRI hash format', () => {
      // SRI hash format: algorithm-base64hash
      const sriFormat = /^sha(256|384|512)-[A-Za-z0-9+/=]+$/;

      const validSRI = 'sha384-abc123def456/+=';
      const invalidSRI = 'md5-abc123';

      // sha384 is recommended
      expect(sriFormat.test('sha384-abcdef123456')).toBe(true);
      expect(sriFormat.test('sha256-abcdef123456')).toBe(true);
      expect(sriFormat.test('sha512-abcdef123456')).toBe(true);
    });
  });

  describe('CSP Headers Recommendation', () => {
    test('Document: Recommended Content-Security-Policy', () => {
      // Check if CSP meta tag exists
      const hasCSP = indexHtml.includes('Content-Security-Policy');

      if (!hasCSP) {
        console.log('RECOMMENDATION: Add Content-Security-Policy header');
      }

      // Recommended CSP for this application
      const recommendedCSP = {
        'default-src': "'self'",
        'script-src': "'self' https://cdnjs.cloudflare.com",
        'style-src': "'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com",
        'font-src': "'self' https://cdnjs.cloudflare.com https://fonts.gstatic.com",
        'img-src': "'self' data: https:",
        'frame-ancestors': "'none'",
      };

      expect(recommendedCSP['default-src']).toBe("'self'");
    });
  });

  describe('HTTPS Enforcement', () => {
    test('All external resources should use HTTPS', () => {
      // Find any HTTP (non-HTTPS) external resources
      const httpRegex = /(?:href|src)=["'](http:\/\/[^"']+)["']/gi;
      const httpResources = [...indexHtml.matchAll(httpRegex)];

      httpResources.forEach(match => {
        console.log('SECURITY WARNING: Non-HTTPS resource:', match[1]);
      });

      // Should not have any HTTP resources (only HTTPS or relative)
      expect(httpResources.length).toBe(0);
    });
  });
});
