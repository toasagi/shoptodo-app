# ShopTodo Login E2E Tests

Simple and focused E2E tests for the ShopTodo login functionality using Cucumber BDD and Playwright.

## 🎯 Test Coverage

This test suite focuses exclusively on login functionality:

- ✅ Successful login with valid credentials
- ✅ Login failure with invalid username
- ✅ Login failure with invalid password
- ✅ Login validation with empty credentials
- ✅ Successful logout functionality

## 🏗️ Structure

```
e2e/
├── features/
│   └── login.feature           # Gherkin scenarios for login tests
├── step-definitions/
│   └── login.steps.ts          # Step definitions for login scenarios
├── support/
│   ├── world.ts                # Test world configuration
│   └── hooks.ts                # Before/After hooks
├── page-objects/
│   ├── LoginPage.ts            # Login page methods
│   └── DashboardPage.ts        # Dashboard page methods
├── package.json                # Dependencies and scripts
├── cucumber.config.js          # Cucumber configuration
└── README.md                   # This file
```

## 🚀 Getting Started

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

In a separate terminal, start the ShopTodo application:

```bash
# From the project root directory
python3 -m http.server 8000
```

Or if port 8000 is busy:

```bash
python3 -m http.server 8002
```

### 4. Run Tests

```bash
# Run all login tests
npm test

# Run only smoke tests (core functionality)
npm run test:smoke

# Run only negative tests (error scenarios)
npm run test:negative

# Run with visible browser (disable headless)
HEADLESS=false npm test

# Run with different browser
BROWSER=firefox npm test
BROWSER=webkit npm test
```

## 🔧 Configuration

### Environment Variables

- `APP_URL`: Application URL (default: `http://localhost:8000`)
- `BROWSER`: Browser to use (default: `chromium`, options: `firefox`, `webkit`)
- `HEADLESS`: Run in headless mode (default: `true`)
- `TIMEOUT`: Page timeout in milliseconds (default: `30000`)

### Example Usage

```bash
# Test on different port
APP_URL=http://localhost:8002 npm test

# Run with visible Firefox browser
BROWSER=firefox HEADLESS=false npm test

# Run with custom timeout
TIMEOUT=60000 npm test
```

## 📊 Test Reports

After running tests, reports are generated in:

- `reports/cucumber-report.json` - JSON format
- `reports/cucumber-report.html` - HTML format
- `screenshots/` - Failure screenshots (automatically taken)

## 🐛 Troubleshooting

### Common Issues

1. **Application not accessible**
   ```bash
   # Check if the application is running
   curl http://localhost:8000

   # If using different port
   APP_URL=http://localhost:8002 npm test
   ```

2. **Browser installation issues**
   ```bash
   # Reinstall browser binaries
   npx playwright install
   ```

3. **Tests timing out**
   ```bash
   # Increase timeout
   TIMEOUT=60000 npm test

   # Run with visible browser to debug
   HEADLESS=false npm test
   ```

## 🎭 Page Object Pattern

This test suite uses the Page Object Pattern for maintainable tests:

- **LoginPage**: Handles login form interactions
- **DashboardPage**: Handles post-login dashboard interactions

## 📝 Adding New Tests

1. Add new scenarios to `features/login.feature` in Gherkin format
2. Implement corresponding step definitions in `step-definitions/login.steps.ts`
3. Add page methods to appropriate page objects if needed

## 🔍 Debugging

### Run with Debug Information

```bash
# Enable debug logs
DEBUG=* npm test

# Run single scenario
npm test -- --tags "@debug"

# Take screenshot on any step
HEADLESS=false npm test
```

### Screenshot on Failure

Screenshots are automatically taken on test failures and saved to the `screenshots/` directory with timestamps.

## 🤝 Contributing

When adding new tests:

1. Follow Gherkin best practices for scenario descriptions
2. Keep step definitions simple and focused
3. Use page objects for UI interactions
4. Add appropriate tags (`@smoke`, `@negative`, etc.)

## 📚 Resources

- [Cucumber.js Documentation](https://cucumber.io/docs/cucumber/)
- [Playwright Documentation](https://playwright.dev/)
- [Gherkin Reference](https://cucumber.io/docs/gherkin/)

## 🏷️ Tags

- `@smoke`: Critical functionality tests
- `@negative`: Error scenario tests
- `@debug`: Tests for debugging purposes