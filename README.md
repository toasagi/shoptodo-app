# ShopTodo - E2E Test Practice Web Application

A simple web application designed for End-to-End (E2E) testing practice.

**Created: September 28, 2025**

**[日本語版はこちら (Japanese Version)](README_jp.md)**

## 🌐 Live Demo

**Try it now: [https://toasagi.github.io/shoptodo-app/](https://toasagi.github.io/shoptodo-app/)**

The application is automatically deployed to GitHub Pages and available for anyone to practice E2E testing!

## Features Overview

### 1. User Authentication
- **Login**: Demo user login functionality
- **Logout**: Session management
- **Demo Credentials**:
  - Username: `demo`
  - Password: `password`

### 2. Product Catalog
- **Product Display**: 12 sample products
- **Search Function**: Partial match search by product name
- **Category Filter**: Electronics, Clothing, Books, Home
- **Sort Function**: By name, price (low to high, high to low)

### 3. Shopping Cart
- **Add Products**: Add products to cart (login required)
- **Quantity Control**: Adjust quantity with +/- buttons
- **Remove Products**: Remove products from cart
- **Total Display**: Automatic total calculation
- **Checkout**: Complete checkout process with order placement

### 4. Checkout Process (New!)
- **Multi-step Wizard**: 3-step checkout flow (Shipping → Payment → Confirmation)
- **Shipping Information**: Name, email, phone, postal code, and address input
- **Payment Methods**: Credit card, bank transfer, or cash on delivery
- **Order Confirmation**: Review order details before placement
- **Order Completion**: Order number generation and confirmation

### 5. Order History (New!)
- **Order Management**: View all past orders
- **Order Details**: Order number, date, items, total, shipping, and payment info
- **Persistent Storage**: Orders saved in localStorage
- **Chronological Display**: Most recent orders shown first

### 6. Todo List (Favorite Product Memo)
- **Add Memo**: Add favorite product memos (login required)
- **Toggle Completion**: Manage completion status with checkboxes
- **Delete Memo**: Remove unwanted memos

### 7. Language Switching Feature
- **Multi-language Support**: Switch between Japanese (JP) and English (EN)
- **Persistent Settings**: Selected language saved to localStorage
- **Full UI Support**: All text, messages, and product names are translated
- **Dynamic Content**: Product lists, cart, and todo lists support language switching

## File Structure

```
shoptodo-app/
├── index.html      # Main HTML (App structure)
├── styles.css      # Stylesheet (Responsive design)
├── app.js          # JavaScript (All functionality)
├── README.md       # This file (English)
└── README_jp.md    # Japanese documentation
```

## Usage

### 1. Starting the Application

We recommend running with a local server:

```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js http-server
npx http-server
```

Access `http://localhost:8000` in your browser.

### 2. Basic Operation Flow

1. **Login**
   - Click the "Login" button
   - Enter username: `demo`, password: `password`
   - Click "Login" to authenticate

2. **Browse & Search Products**
   - Browse products from the product list
   - Search for products by name in the search box
   - Filter by category or sort options

3. **Shopping**
   - Click "Add to Cart" button on products
   - Adjust quantities in the sidebar cart
   - Click "Checkout" to start purchase process

4. **Checkout Process**
   - Fill in shipping information (name, email, phone, address)
   - Select payment method (credit card, bank transfer, or cash on delivery)
   - Review order details and confirm
   - Receive order number upon completion

5. **Order History**
   - Click "View Order History" button
   - View list of all past orders
   - See detailed information for each order

6. **Memo Management**
   - Add favorite product memos to the todo list
   - Mark as complete or delete memos

7. **Language Switching**
   - Use "EN"/"JP" buttons in the header to switch languages
   - Settings are auto-saved and applied on next visit

## E2E Testing Points

This application is suitable for the following test scenarios:

### Authentication Flow
- Login success/failure testing
- UI changes based on login state
- Logout functionality

### Product Search & Filter
- Search functionality verification
- Category filter application
- Sort function validation

### Shopping Cart
- Product addition behavior
- Quantity change confirmation
- Cart content persistence

### Checkout Process
- Multi-step form validation
- Payment method selection
- Order data persistence
- Order number generation
- Cart clearing after checkout

### Order History
- Order list display
- Order detail information
- Data persistence across sessions
- Empty state handling

### Todo List
- Item addition/deletion
- Completion status toggle
- Data persistence

### Responsive Design
- Display confirmation on different screen sizes
- Mobile display usability

### Language Switching
- Japanese and English language switching functionality
- Verification of translated UI elements
- Language setting persistence testing

## Data Management

- **localStorage** for data persistence
- Stores session information, cart contents, todo lists, and language settings
- Data is retained after page reload

## Technical Specifications

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Data Storage**: localStorage
- **Responsive**: CSS Grid, Flexbox
- **Multi-language**: Translation management with i18n objects
- **Modern Browser Support**: ES6+

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Customization

### Changing Product Data
You can edit product data in the `initializeData()` method in `app.js`.

### Style Adjustments
Customize the design in `styles.css`.

### Adding New Features
Extend the `AppState` and `UIManager` classes in `app.js` to add new functionality.

## Testing

This project includes comprehensive unit tests using Jest and E2E tests using Cucumber BDD + Playwright.

### Unit Tests

First, install the dependencies:

```bash
npm install
```

Run all unit tests:

```bash
npm test
```

Run tests in watch mode (for development):

```bash
npm run test:watch
```

Generate test coverage report:

```bash
npm run test:coverage
```

### E2E Tests

Navigate to the e2e directory and install dependencies:

```bash
cd e2e
npm install
npx playwright install
```

Run E2E tests:

```bash
# All tests
npm test

# Smoke tests only
npm run test:smoke

# Checkout tests
npm run test:checkout

# Order history tests
npm run test:order-history
```

### Test Structure

```
tests/
├── setup.js              # Jest configuration and mocks
├── testUtils.js          # Testing utilities and helpers
├── AppState.test.js      # AppState class unit tests
├── UIManager.test.js     # UIManager class unit tests
└── i18n.test.js          # Translation data validation tests
```

### Test Coverage

The unit test suite covers:

- **Authentication**: Login/logout functionality
- **Cart Management**: Add, remove, update quantities, calculate totals
- **Todo Management**: Add, toggle, delete todo items
- **Product Filtering**: Search, category filters, sorting
- **Language Switching**: UI translation and persistence
- **Data Persistence**: localStorage operations
- **Translation Data**: i18n key consistency and completeness
- **Order Management**: Order creation, persistence, and retrieval

Target coverage: 90%+ for branches, functions, lines, and statements.

## E2E Automation Testing

This project includes comprehensive E2E automation testing using Cucumber BDD + Playwright.

### E2E Test Structure

```
e2e/
├── features/                    # Gherkin feature files
│   ├── login.feature           # Login test scenarios
│   ├── checkout.feature        # Checkout process scenarios
│   └── simple.feature          # Basic connection test
├── page-objects/               # Page Object Model
│   ├── LoginPage.ts           # Login page methods
│   ├── DashboardPage.ts       # Dashboard page methods
│   └── CheckoutPage.ts        # Checkout and order history methods
├── step-definitions/          # Cucumber step definitions
│   ├── login.steps.ts         # Login step definitions
│   ├── checkout.steps.ts      # Checkout step definitions
│   └── simple.steps.ts        # Simple test steps
├── support/                   # Test support
│   ├── world.ts              # Test execution environment
│   └── hooks.ts              # Before/After hooks
├── screenshots/              # Test failure screenshots (gitignored)
├── reports/                  # Test reports
├── package.json             # Dependencies and scripts
├── cucumber.config.js       # Cucumber configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # E2E test documentation
```

### Running E2E Tests

#### 1. Install E2E Dependencies

```bash
cd e2e
npm install
npx playwright install
```

#### 2. Start Application Server

In a separate terminal, start the application:

```bash
# From project root directory
python3 -m http.server 8000
```

#### 3. Execute E2E Tests

```bash
cd e2e

# Run all login tests
npm test

# Smoke tests (core login functionality)
npm run test:smoke

# Negative tests (error scenarios)
npm run test:negative

# Debug tests (basic connection test)
npm run test:debug
```

#### 4. Cross-browser Testing

```bash
# Run with specific browser
BROWSER=firefox npm test
BROWSER=webkit npm test

# Disable headless mode (show browser)
HEADLESS=false npm test
```

### E2E Test Features

#### Current Test Coverage
- **Login Functionality**: Complete login flow testing
  - Successful login with valid credentials
  - Login failure with invalid credentials
  - Empty field validation
  - Logout functionality
- **Checkout Process**: Full checkout flow testing
  - Multi-step form completion
  - Payment method selection
  - Order confirmation and completion
  - Form validation testing
- **Order History**: Order management testing
  - Order history display
  - Order persistence
  - Empty state handling
- **Basic Connection**: Application availability verification

#### Technologies Used
- **Cucumber BDD**: Natural language test scenarios in Gherkin format
- **Playwright**: Cross-browser automation (Chromium, Firefox, WebKit)
- **TypeScript**: Type-safe test code
- **Page Object Model**: Maintainable test structure

#### Test Configuration
- **Environment Variables**:
  - `APP_URL`: Application URL (default: http://localhost:8000)
  - `BROWSER`: Browser selection (chromium/firefox/webkit)
  - `HEADLESS`: Headless mode control
  - `TIMEOUT`: Test timeout configuration

For detailed E2E test documentation, see [e2e/README.md](e2e/README.md)

### CI/CD Integration

Automated test execution with GitHub Actions:

```yaml
# Automatic execution triggers
- Push/Pull Request
- Daily at 2 AM UTC (scheduled)
- Manual execution

# Supported browsers
- Chromium
- Firefox
- WebKit (Safari)

# Test types
- Smoke tests
- Regression tests
- Performance tests (Lighthouse)
```

### Test Reports

After test execution, the following reports are generated:

- **Cucumber HTML Report**: `e2e/reports/cucumber-report.html`
- **Playwright Report**: `e2e/playwright-report/`
- **Screenshots**: `e2e/screenshots/` (on failure)
- **GitHub Actions**: CI execution results and artifacts

### ISTQB Compliant Test Documentation

Professional test process documentation is included:

```
docs/                              # General test documentation
├── test-planning/
│   ├── test-strategy.md          # Test strategy document
│   ├── test-plan.md              # Test plan document
│   └── risk-analysis.md          # Risk analysis document
├── test-analysis/
│   ├── requirements-analysis.md  # Requirements analysis document
│   └── test-observation-matrix.md # Test observation matrix
└── test-design/
    ├── user-stories.md           # User stories
    ├── test-scenarios.md         # Test scenarios
    ├── test-cases.md             # Test cases
    └── traceability-matrix.md    # Traceability matrix

docs2/                             # Checkout feature test documentation
├── test-case-analysis.md         # Existing test case analysis
├── checkout-test-plan.md         # Checkout test plan (ISTQB)
├── checkout-test-analysis.md     # Checkout test analysis
├── checkout-test-cases.md        # Checkout test case specifications
└── checkout-test-report.md       # Test execution report
```

### Error Handling and Debugging

- **Automatic Screenshots**: Captured automatically on test failure
- **Detailed Logging**: Step-by-step execution logs
- **Retry Functionality**: Automatic retry for unstable tests
- **Timeout Settings**: Proper element waiting configuration

## Deployment

This application is automatically deployed to GitHub Pages using GitHub Actions.

### Deployment Workflow

1. **Development**: Create a feature branch and make changes
2. **Pull Request**: Open a PR to merge into the `main` branch
3. **Review**: Code review and approval (if branch protection is enabled)
4. **Merge**: Merge the PR into `main`
5. **Auto-Deploy**: GitHub Actions automatically deploys to GitHub Pages

### Deployment Configuration

The deployment is triggered automatically when changes are pushed to the `main` branch:

```yaml
on:
  push:
    branches: [main]
```

**Live URL**: [https://toasagi.github.io/shoptodo-app/](https://toasagi.github.io/shoptodo-app/)

### Branch Protection (Recommended)

To prevent direct pushes to `main` and ensure all changes go through PRs:

1. Go to **Settings** > **Branches**
2. Click **Add rule** for branch name pattern: `main`
3. Enable:
   - ☑ Require pull request before merging
   - ☑ Require approvals (optional)

This ensures quality control and automatic deployment only after code review.

## Notes

- This application is for **educational and testing purposes only**
- No actual payment functionality is included
- Data is stored in browser localStorage
- Security features are minimal

## License

This project is released under the MIT License. Free use for learning and testing purposes is permitted.