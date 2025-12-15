/**
 * Security Test Helper Functions
 * Utility functions for security testing
 */

/**
 * Check if a string contains potential XSS elements
 * @param {string} html - HTML string to check
 * @returns {boolean} - True if potentially dangerous elements found
 */
function containsXSSElements(html) {
  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /on\w+\s*=/gi, // Event handlers like onclick=, onerror=
    /javascript:/gi,
    /<iframe/gi,
    /<svg[^>]*onload/gi,
    /<img[^>]*onerror/gi,
  ];

  return dangerousPatterns.some(pattern => pattern.test(html));
}

/**
 * Sanitize HTML by escaping dangerous characters
 * @param {string} str - String to sanitize
 * @returns {string} - Sanitized string
 */
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Get all localStorage data
 * @returns {Object} - Object containing all localStorage key-value pairs
 */
function dumpLocalStorage() {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    try {
      data[key] = JSON.parse(localStorage.getItem(key));
    } catch {
      data[key] = localStorage.getItem(key);
    }
  }
  return data;
}

/**
 * Check if localStorage contains sensitive data patterns
 * @param {string} value - Value to check
 * @returns {Object} - Object with found sensitive patterns
 */
function findSensitiveDataPatterns(value) {
  const str = typeof value === 'string' ? value : JSON.stringify(value);

  const patterns = {
    password: /password/i,
    creditCard: /\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}/,
    email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
    phone: /\d{2,4}-\d{3,4}-\d{4}/,
    postalCode: /\d{3}-\d{4}/,
  };

  const found = {};
  for (const [name, pattern] of Object.entries(patterns)) {
    if (pattern.test(str)) {
      found[name] = true;
    }
  }
  return found;
}

/**
 * Check if element has script execution capability
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} - True if element could execute scripts
 */
function hasScriptExecutionRisk(element) {
  // Check for script tags
  const scripts = element.querySelectorAll('script');
  if (scripts.length > 0) return true;

  // Event handler attributes to check
  const eventHandlerAttrs = [
    'onclick', 'onerror', 'onload', 'onmouseover', 'onfocus',
    'onblur', 'onchange', 'onsubmit', 'onkeydown', 'onkeyup',
    'ontoggle', 'onstart', 'onmouseenter', 'onmouseleave',
  ];

  // Check elements with event handler attributes
  const allElements = element.querySelectorAll('*');
  for (const el of allElements) {
    for (const attr of eventHandlerAttrs) {
      if (el.hasAttribute(attr)) return true;
    }
    // Check for javascript: URLs
    if (el.href && el.href.startsWith('javascript:')) return true;
    if (el.src && el.src.startsWith('javascript:')) return true;
  }

  return false;
}

/**
 * Create a safe DOM container for testing
 * @returns {HTMLElement} - Isolated container element
 */
function createTestContainer() {
  const container = document.createElement('div');
  container.id = 'security-test-container';
  container.style.display = 'none';
  document.body.appendChild(container);
  return container;
}

/**
 * Clean up test container
 * @param {HTMLElement} container - Container to remove
 */
function cleanupTestContainer(container) {
  if (container && container.parentNode) {
    container.parentNode.removeChild(container);
  }
}

/**
 * Check for SRI (Subresource Integrity) on external resources
 * @param {Document} doc - Document to check
 * @returns {Array} - Array of resources without SRI
 */
function findResourcesWithoutSRI(doc = document) {
  const externalResources = [];

  // Check link tags (CSS)
  doc.querySelectorAll('link[href*="://"]').forEach(link => {
    if (!link.integrity) {
      externalResources.push({
        type: 'link',
        href: link.href,
        hasSRI: false,
      });
    }
  });

  // Check script tags
  doc.querySelectorAll('script[src*="://"]').forEach(script => {
    if (!script.integrity) {
      externalResources.push({
        type: 'script',
        src: script.src,
        hasSRI: false,
      });
    }
  });

  return externalResources;
}

/**
 * Mock alert/confirm/prompt for XSS detection
 * @returns {Object} - Object with spy functions and call tracking
 */
function mockDialogs() {
  const calls = {
    alert: [],
    confirm: [],
    prompt: [],
  };

  const originalAlert = window.alert;
  const originalConfirm = window.confirm;
  const originalPrompt = window.prompt;

  window.alert = (msg) => calls.alert.push(msg);
  window.confirm = (msg) => { calls.confirm.push(msg); return false; };
  window.prompt = (msg) => { calls.prompt.push(msg); return null; };

  return {
    calls,
    restore: () => {
      window.alert = originalAlert;
      window.confirm = originalConfirm;
      window.prompt = originalPrompt;
    },
    wasAlertCalled: () => calls.alert.length > 0,
    wasAnyDialogCalled: () =>
      calls.alert.length > 0 || calls.confirm.length > 0 || calls.prompt.length > 0,
  };
}

module.exports = {
  containsXSSElements,
  escapeHTML,
  dumpLocalStorage,
  findSensitiveDataPatterns,
  hasScriptExecutionRisk,
  createTestContainer,
  cleanupTestContainer,
  findResourcesWithoutSRI,
  mockDialogs,
};
