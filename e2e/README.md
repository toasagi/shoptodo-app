# ShopTodo E2E Tests

Comprehensive E2E test suite for the ShopTodo application using Cucumber BDD and Playwright.

## Test Coverage

This test suite covers **74 scenarios** across **11 feature files**:

| Feature | File | Scenarios | Description |
|---------|------|-----------|-------------|
| Authentication | `login.feature` | 8 | Login/logout, validation, error handling |
| Checkout | `checkout.feature` | 13 | Multi-step checkout, payment methods, order completion |
| Shopping Cart | `cart.feature` | 6 | Add/remove items, quantity updates |
| Product Search | `search.feature` | 8 | Search, filter, sort functionality |
| Category Navigation | `category-tabs.feature` | 11 | Category filtering, tab interactions |
| Language Switching | `language.feature` | 7 | i18n, Japanese/English UI |
| Recommended Products | `recommended.feature` | 6 | Recommended section, add to cart |
| Product Workflows | `product-workflow.feature` | 6 | End-to-end purchase workflows |
| Accessibility | `accessibility.feature` | 5 | WCAG compliance, ARIA attributes |
| Todo/Memo | `todo.feature` | 3 | Add/toggle/delete memos |
| Basic Connection | `simple.feature` | 1 | Application availability |

## Project Structure

```
e2e/
├── features/                    # Gherkin feature files (11 files)
│   ├── login.feature           # Authentication scenarios
│   ├── checkout.feature        # Checkout process scenarios
│   ├── cart.feature            # Shopping cart scenarios
│   ├── search.feature          # Product search scenarios
│   ├── category-tabs.feature   # Category navigation scenarios
│   ├── language.feature        # i18n scenarios
│   ├── recommended.feature     # Recommended products scenarios
│   ├── product-workflow.feature # E2E workflow scenarios
│   ├── accessibility.feature   # Accessibility scenarios
│   ├── todo.feature            # Todo/memo scenarios
│   └── simple.feature          # Basic connection test
│
├── step-definitions/           # Step definitions (11 files)
│   ├── login.steps.ts
│   ├── checkout.steps.ts
│   ├── cart.steps.ts
│   ├── search.steps.ts
│   ├── category-tabs.steps.ts
│   ├── language.steps.ts
│   ├── recommended.steps.ts
│   ├── product-workflow.steps.ts
│   ├── accessibility.steps.ts
│   ├── todo.steps.ts
│   └── simple.steps.ts
│
├── page-objects/               # Page Object Model
│   ├── LoginPage.ts           # Login page methods
│   ├── DashboardPage.ts       # Dashboard/product page methods
│   └── CheckoutPage.ts        # Checkout and order methods
│
├── support/                    # Test support files
│   ├── world.ts               # Test world configuration
│   └── hooks.ts               # Before/After hooks
│
├── screenshots/                # Failure screenshots (gitignored)
├── allure-results/             # Allure report data (gitignored)
├── reports/                    # Test reports
├── package.json               # Dependencies and scripts
├── cucumber.config.js         # Cucumber configuration
├── tsconfig.json              # TypeScript configuration
└── README.md                  # This file
```

## Getting Started

### 1. Install Dependencies

```bash
cd e2e
npm install
```

### 2. Install Browser Binaries

```bash
npm run install:browsers
```

### 3. Start the Application

In a separate terminal:

```bash
# From project root
python3 -m http.server 8000

# Or use npm script from project root
npm run serve
```

### 4. Run Tests

```bash
# Run all tests
npm test

# Run smoke tests (core functionality)
npm run test:smoke

# Run specific test suites
npm run test:checkout      # Checkout tests
npm run test:a11y          # Accessibility tests
npm run test:negative      # Error scenarios

# Run with visible browser
HEADLESS=false npm test

# Run with different browser
BROWSER=firefox npm test
BROWSER=webkit npm test
```

## Test Tags

Use tags to run specific test subsets:

| Tag | Description |
|-----|-------------|
| `@smoke` | Core functionality tests |
| `@checkout` | Checkout process tests |
| `@cart` | Shopping cart tests |
| `@search` | Product search tests |
| `@category-tabs` | Category navigation tests |
| `@i18n` | Language switching tests |
| `@japanese-ui` | Japanese UI tests |
| `@recommended` | Recommended products tests |
| `@workflow` | End-to-end workflows |
| `@a11y` | Accessibility tests |
| `@negative` | Error scenario tests |
| `@order-history` | Order history tests |

### Running by Tags

```bash
# Single tag
npm test -- --tags "@smoke"

# Multiple tags (OR)
npm test -- --tags "@smoke or @checkout"

# Multiple tags (AND)
npm test -- --tags "@checkout and @negative"

# Exclude tags
npm test -- --tags "not @slow"
```

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `APP_URL` | `http://localhost:8000` | Application URL |
| `BROWSER` | `chromium` | Browser (chromium/firefox/webkit) |
| `HEADLESS` | `true` | Run in headless mode |
| `TIMEOUT` | `30000` | Page timeout in milliseconds |

### Example Usage

```bash
# Run with Firefox, visible browser, custom URL
APP_URL=http://localhost:8001 BROWSER=firefox HEADLESS=false npm test

# Run with increased timeout
TIMEOUT=60000 npm test
```

## Test Reports

### Allure Report

Test results are captured for Allure reporting:

```bash
# Results are saved to allure-results/
# Generate report (requires Allure CLI)
allure generate allure-results -o allure-report
allure open allure-report
```

### Screenshots

Failure screenshots are automatically captured and saved to `screenshots/` directory.

## Page Object Pattern

The test suite uses Page Object Pattern for maintainability:

- **LoginPage**: Login form interactions, validation
- **DashboardPage**: Product catalog, cart, search, filters
- **CheckoutPage**: Checkout wizard, order history

## Troubleshooting

### Common Issues

1. **Application not accessible**
   ```bash
   # Verify application is running
   curl http://localhost:8000

   # Start if needed
   python3 -m http.server 8000
   ```

2. **Browser installation issues**
   ```bash
   npx playwright install
   ```

3. **Tests timing out**
   ```bash
   # Increase timeout
   TIMEOUT=60000 npm test

   # Debug with visible browser
   HEADLESS=false npm test
   ```

4. **Step definition not found**
   - Check that step text matches exactly
   - Verify step file is in `step-definitions/` directory
   - Check for TypeScript compilation errors

## Adding New Tests

1. **Add scenarios** to appropriate `features/*.feature` file
2. **Implement steps** in corresponding `step-definitions/*.steps.ts`
3. **Add page methods** to page objects if needed
4. **Tag appropriately** (`@smoke`, `@negative`, etc.)

### Example Scenario

```gherkin
@smoke @cart
Scenario: Add product to cart
  Given the user is logged in as "demo"
  When the user adds "Smartphone" to the cart
  Then the cart should contain 1 item
```

## CI/CD Integration

Tests run automatically via GitHub Actions:

- **Trigger**: Push/PR to main, daily schedule, manual
- **Browsers**: Chromium, Firefox, WebKit
- **Reports**: Allure reports published to GitHub Pages

See `.github/workflows/e2e-tests.yml` for configuration.

## Resources

- [Cucumber.js Documentation](https://cucumber.io/docs/cucumber/)
- [Playwright Documentation](https://playwright.dev/)
- [Gherkin Reference](https://cucumber.io/docs/gherkin/)
- [Allure Report](https://docs.qameta.io/allure/)
