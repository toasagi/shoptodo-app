# ShopTodo - E2E Test Practice Web Application

A simple web application designed for End-to-End (E2E) testing practice.

**[日本語版はこちら (Japanese Version)](README_jp.md)**

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
- **Checkout**: Purchase process simulation

### 4. Todo List (Favorite Product Memo)
- **Add Memo**: Add favorite product memos (login required)
- **Toggle Completion**: Manage completion status with checkboxes
- **Delete Memo**: Remove unwanted memos

### 5. Language Switching Feature
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
   - Click "Checkout" to complete purchase

4. **Memo Management**
   - Add favorite product memos to the todo list
   - Mark as complete or delete memos

5. **Language Switching**
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
- Checkout process

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

This project includes comprehensive unit tests using Jest.

### Running Tests

First, install the dependencies:

```bash
npm install
```

Run all tests:

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

The test suite covers:

- **Authentication**: Login/logout functionality
- **Cart Management**: Add, remove, update quantities, calculate totals
- **Todo Management**: Add, toggle, delete todo items
- **Product Filtering**: Search, category filters, sorting
- **Language Switching**: UI translation and persistence
- **Data Persistence**: localStorage operations
- **Translation Data**: i18n key consistency and completeness

Target coverage: 80%+ for branches, functions, lines, and statements.

## E2E Automation Testing

This project includes comprehensive E2E automation testing using Page Object Model + Cucumber BDD.

### E2E Automation Structure

```
e2e/
├── features/                    # Gherkin feature files
│   ├── authentication.feature  # Authentication test scenarios
│   ├── product-catalog.feature # Product catalog tests
│   ├── shopping-cart.feature   # Shopping cart functionality
│   ├── todo-list.feature       # Todo list functionality
│   ├── language-switching.feature # Language switching
│   ├── data-persistence.feature # Data persistence
│   └── end-to-end-scenarios.feature # End-to-end scenarios
├── page-objects/               # Page Object Model
│   ├── BasePage.ts            # Common page object
│   ├── LoginPage.ts           # Login page
│   ├── DashboardPage.ts       # Main dashboard
│   └── CartPage.ts            # Cart page
├── step-definitions/          # Cucumber step definitions
│   ├── authentication.steps.ts # Authentication steps
│   ├── product-catalog.steps.ts # Product catalog steps
│   ├── shopping-cart.steps.ts # Cart steps
│   └── common.steps.ts        # Common steps
├── support/                   # Test support
│   ├── world.ts              # Test execution environment
│   └── hooks.ts              # Before/After hooks
├── data/                     # Test data
│   └── test-data.json        # Test data sets
└── utils/                    # Utilities
    └── TestDataManager.ts    # Test data management
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
npm run serve
```

#### 3. Execute E2E Tests

```bash
cd e2e

# Smoke tests (core functionality only)
npm run test:e2e:smoke

# Regression tests (all functionality)
npm run test:e2e:regression

# Parallel execution (faster)
npm run test:e2e:parallel

# Debug tests
npm run test:e2e:debug

# Run all tests
npm run test:e2e
```

#### 4. Cross-browser Testing

```bash
# Run with specific browser
BROWSER=firefox npm run test:e2e
BROWSER=webkit npm run test:e2e

# Disable headless mode (show browser)
HEADLESS=false npm run test:e2e
```

### E2E Automation Features

#### Page Object Model (POM)
- **BasePage**: Common functionality (navigation, element operations, screenshots)
- **LoginPage**: Login functionality methods
- **DashboardPage**: Main screen functionality (products, cart, todo, language)
- **CartPage**: Shopping cart specific functionality

#### BDD (Behavior Driven Development)
- **Gherkin Format**: Readable test scenarios written in Given-When-Then format
- **Business Value**: Natural language test descriptions stakeholders can understand
- **Traceability**: Complete traceability from requirements to test cases

#### Test Data Management
- **TestDataManager**: Centralized test data management
- **Multi-language Support**: Test data for both Japanese and English
- **Type Safety**: TypeScript type checking

### Automation Coverage

| Functionality | Test Cases | Automation Rate |
|--------------|------------|-----------------|
| Authentication | 9 | 100% |
| Product Catalog | 19 | 100% |
| Shopping Cart | 13 | 100% |
| Todo List | 8 | 100% |
| Language Switching | 5 | 100% |
| Data Persistence | 4 | 100% |
| **Total** | **58** | **100%** |

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

Professional test process documentation is also included:

```
docs/
├── test-planning/
│   ├── test-strategy.md        # Test strategy document
│   ├── test-plan.md           # Test plan document
│   └── risk-analysis.md       # Risk analysis document
├── test-analysis/
│   ├── requirements-analysis.md # Requirements analysis document
│   └── test-observation-matrix.md # Test observation matrix
└── test-design/
    ├── user-stories.md        # User stories
    ├── test-scenarios.md      # Test scenarios
    ├── test-cases.md          # Test cases
    └── traceability-matrix.md # Traceability matrix
```

### Error Handling and Debugging

- **Automatic Screenshots**: Captured automatically on test failure
- **Detailed Logging**: Step-by-step execution logs
- **Retry Functionality**: Automatic retry for unstable tests
- **Timeout Settings**: Proper element waiting configuration

## Notes

- This application is for **educational and testing purposes only**
- No actual payment functionality is included
- Data is stored in browser localStorage
- Security features are minimal

## License

This project is released under the MIT License. Free use for learning and testing purposes is permitted.