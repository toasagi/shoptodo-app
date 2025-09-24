import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

/**
 * End-to-End Scenarios Step Definitions
 * Maps to end-to-end-scenarios.feature scenarios
 * Test Cases: Integration scenarios covering complete user workflows
 * Requirements: All functional requirements REQ-F-001 to REQ-F-011
 */

// Given Steps
Given('a new user accesses the application for the first time', async function(this: CustomWorld) {
  await this.clearApplicationState();
  await this.pageObjects.dashboardPage.goto();
  await this.pageObjects.dashboardPage.waitForPageLoad();
  
  // Verify clean state
  const isLoggedIn = await this.pageObjects.loginPage.isUserAlreadyLoggedIn();
  expect(isLoggedIn, 'User should not be logged in initially').toBe(false);
});

Given('the user is a returning customer', async function(this: CustomWorld) {
  // Set up returning customer state
  const returningCustomerData = {
    login: { username: 'demo', isLoggedIn: true },
    cart: [
      { name: 'スマートフォン', quantity: 1 },
      { name: 'ノートパソコン', quantity: 1 }
    ],
    todos: [
      { text: '前回のお気に入り商品', completed: false },
      { text: '購入済み商品レビュー', completed: true }
    ],
    language: 'jp'
  };
  
  await this.pageObjects.dashboardPage.setApplicationState(returningCustomerData);
  this.setTestData('returningCustomerData', returningCustomerData);
});

Given('the user has previous session data', async function(this: CustomWorld) {
  const sessionData = this.getTestData('returningCustomerData');
  expect(sessionData, 'Previous session data should exist').toBeDefined();
});

Given('the user is actively using multiple features', async function(this: CustomWorld) {
  await this.pageObjects.loginPage.login('demo', 'password');
  
  // Set up active usage state
  await this.pageObjects.dashboardPage.addProductToCart('スマートフォン', 2);
  await this.pageObjects.dashboardPage.addTodo('アクティブタスク1');
  await this.pageObjects.dashboardPage.setLanguage('en');
  await this.pageObjects.dashboardPage.searchProducts('Smart');
});

Given('the user is in the middle of multiple operations', async function(this: CustomWorld) {
  await this.pageObjects.loginPage.login('demo', 'password');
  
  // Start multiple operations
  await this.pageObjects.dashboardPage.addProductToCart('スマートフォン', 1);
  await this.pageObjects.dashboardPage.addTodo('進行中のタスク');
  
  this.setTestData('operationsInProgress', true);
});

Given('the user is performing typical operations', async function(this: CustomWorld) {
  await this.pageObjects.loginPage.login('demo', 'password');
  
  // Set up for performance testing
  this.setTestData('performanceTestStartTime', Date.now());
});

Given('the user has accessibility requirements', async function(this: CustomWorld) {
  // Note: In real implementation, this would configure accessibility testing tools
  this.setTestData('accessibilityMode', true);
});

Given('the user is accessing the application on a mobile device', async function(this: CustomWorld) {
  // Set mobile viewport
  await this.page.setViewportSize({ width: 375, height: 667 });
  this.setTestData('isMobileDevice', true);
});

Given('the user is concerned about security', async function(this: CustomWorld) {
  await this.pageObjects.loginPage.login('demo', 'password');
  this.setTestData('securityTestMode', true);
});

Given('this application is used for testing education', async function(this: CustomWorld) {
  // Set up educational context
  this.setTestData('educationalMode', true);
});

// When Steps - User Actions and Workflows
When('the user switches to English for better accessibility', async function(this: CustomWorld) {
  await this.pageObjects.dashboardPage.setLanguage('en');
  await this.page.waitForTimeout(500);
});

When('the user logs in with credentials {string} and {string}', async function(this: CustomWorld, username: string, password: string) {
  await this.pageObjects.loginPage.login(username, password);
  this.setTestData('loginCredentials', { username, password });
});

When('the user searches for {string} in the search box', async function(this: CustomWorld, searchTerm: string) {
  await this.pageObjects.dashboardPage.searchProducts(searchTerm);
  this.setTestData('searchTerm', searchTerm);
});

When('the user applies the {string} category filter', async function(this: CustomWorld, category: string) {
  await this.pageObjects.dashboardPage.applyFilter('category', category);
  this.setTestData('appliedFilter', category);
});

When('the user adds {string} to the cart {int} times', async function(this: CustomWorld, productName: string, quantity: number) {
  await this.pageObjects.dashboardPage.addProductToCart(productName, quantity);
  this.setTestData('lastAddedProduct', { name: productName, quantity });
});

When('the user adds {string} to the todo list', async function(this: CustomWorld, todoText: string) {
  await this.pageObjects.dashboardPage.addTodo(todoText);
  this.setTestData('lastAddedTodo', todoText);
});

When('the user navigates to the cart page', async function(this: CustomWorld) {
  await this.pageObjects.dashboardPage.navigateToCart();
  await this.page.waitForTimeout(500);
});

When('the user completes the checkout process', async function(this: CustomWorld) {
  await this.pageObjects.dashboardPage.completeCheckout();
  this.setTestData('checkoutCompleted', true);
});

When('the user performs the following operations in sequence:', async function(this: CustomWorld, dataTable) {
  const operations = dataTable.hashes();
  
  for (const operation of operations) {
    const step = operation.Step;
    const operationType = operation.Operation;
    const details = operation.Details;
    
    switch (operationType) {
      case 'Add Product A to cart':
        await this.pageObjects.dashboardPage.addProductToCart(details, 1);
        break;
      case 'Switch language':
        const targetLang = details === 'to English' ? 'en' : 'jp';
        await this.pageObjects.dashboardPage.setLanguage(targetLang);
        break;
      case 'Add Product B to cart':
        await this.pageObjects.dashboardPage.addProductToCart(details, 1);
        break;
      case 'Add Todo item 1':
        await this.pageObjects.dashboardPage.addTodo(details.replace(/"/g, ''));
        break;
      case 'Change Product A quantity':
        const quantity = parseInt(details.replace('to ', ''));
        await this.pageObjects.dashboardPage.updateCartItemQuantity('スマートフォン', quantity);
        break;
      case 'Mark Todo item 1 as completed':
        await this.pageObjects.dashboardPage.toggleTodoCompletion('item1');
        break;
    }
    
    await this.page.waitForTimeout(500);
  }
});

When('the user opens the application', async function(this: CustomWorld) {
  await this.pageObjects.dashboardPage.goto();
  await this.pageObjects.dashboardPage.waitForPageLoad();
});

When('the user browses different product categories:', async function(this: CustomWorld, dataTable) {
  const categories = dataTable.hashes();
  
  for (const categoryData of categories) {
    const category = categoryData.Category;
    const action = categoryData.Action;
    
    await this.pageObjects.dashboardPage.navigateToCategory(category);
    
    if (action.includes('Compare')) {
      await this.pageObjects.dashboardPage.compareProductsInCategory(category);
    } else if (action.includes('Check') && action.includes('prices')) {
      await this.pageObjects.dashboardPage.checkPricesInCategory(category);
    } else if (action.includes('Look for')) {
      await this.pageObjects.dashboardPage.searchInCategory(category, 'programming');
    }
    
    await this.page.waitForTimeout(500);
  }
});

When('the user uses various filters and sorts', async function(this: CustomWorld) {
  await this.pageObjects.dashboardPage.applyFilter('category', 'electronics');
  await this.pageObjects.dashboardPage.applySort('price', 'low-to-high');
  await this.page.waitForTimeout(500);
});

When('the user adds multiple products to their wishlist:', async function(this: CustomWorld, dataTable) {
  const wishlistItems = dataTable.hashes();
  
  for (const item of wishlistItems) {
    const product = item.Product;
    const priority = item.Priority;
    
    await this.pageObjects.dashboardPage.addTodo(`${product} - Priority: ${priority}`);
  }
  
  this.setTestData('wishlistItems', wishlistItems);
});

When('the user moves selected wishlist items to cart', async function(this: CustomWorld) {
  const wishlistItems = this.getTestData('wishlistItems');
  
  for (const item of wishlistItems) {
    if (item.Priority === 'High') {
      await this.pageObjects.dashboardPage.addProductToCart(item.Product, 1);
    }
  }
});

When('the user adjusts quantities based on budget', async function(this: CustomWorld) {
  // Simulate budget-based adjustments
  await this.pageObjects.dashboardPage.updateCartItemQuantity('Wireless Earphones', 1);
  await this.pageObjects.dashboardPage.updateCartItemQuantity('Programming Book', 2);
});

When('the user proceeds with checkout', async function(this: CustomWorld) {
  await this.pageObjects.dashboardPage.completeCheckout();
});

When('the user performs overlapping operations:', async function(this: CustomWorld, dataTable) {
  const operations = dataTable.hashes();
  
  for (const operation of operations) {
    const featureCombination = operation['Feature Combination'];
    const testScenario = operation['Test Scenario'];
    
    switch (featureCombination) {
      case 'Search + Language':
        await this.pageObjects.dashboardPage.searchProducts('スマート');
        await this.pageObjects.dashboardPage.setLanguage('en');
        await this.pageObjects.dashboardPage.searchProducts('Smart');
        break;
      case 'Cart + Todo':
        await this.pageObjects.dashboardPage.addProductToCart('スマートフォン', 1);
        await this.pageObjects.dashboardPage.addTodo('スマートフォン購入を検討');
        break;
      case 'Filter + Sort + Search':
        await this.pageObjects.dashboardPage.searchProducts('ノート');
        await this.pageObjects.dashboardPage.applyFilter('category', 'electronics');
        await this.pageObjects.dashboardPage.applySort('price', 'high-to-low');
        break;
      case 'Persistence + All Features':
        await this.pageObjects.dashboardPage.addProductToCart('Laptop', 1);
        await this.pageObjects.dashboardPage.addTodo('Test persistence');
        await this.pageObjects.dashboardPage.setLanguage('jp');
        await this.page.reload();
        break;
    }
    
    await this.page.waitForTimeout(1000);
  }
});

When('various error conditions occur:', async function(this: CustomWorld, dataTable) {
  const errorScenarios = dataTable.hashes();
  
  for (const scenario of errorScenarios) {
    const errorType = scenario['Error Type'];
    
    switch (errorType) {
      case 'Network interruption':
        await this.simulateNetworkError();
        break;
      case 'localStorage full':
        await this.simulateStorageQuotaExceeded();
        break;
      case 'Invalid data input':
        await this.pageObjects.dashboardPage.enterInvalidData();
        break;
      case 'Browser compatibility':
        await this.simulateBrowserCompatibilityIssue();
        break;
    }
    
    await this.page.waitForTimeout(1000);
  }
});

When('the user executes common workflows:', async function(this: CustomWorld, dataTable) {
  const workflows = dataTable.hashes();
  
  for (const workflow of workflows) {
    const workflowType = workflow.Workflow;
    const startTime = Date.now();
    
    switch (workflowType) {
      case 'Login':
        await this.pageObjects.loginPage.login('demo', 'password');
        break;
      case 'Product browsing':
        await this.pageObjects.dashboardPage.navigateToProductCatalog();
        await this.pageObjects.dashboardPage.searchProducts('Smart');
        break;
      case 'Cart operations':
        await this.pageObjects.dashboardPage.addProductToCart('スマートフォン', 1);
        break;
      case 'Language switching':
        await this.pageObjects.dashboardPage.setLanguage('en');
        break;
      case 'Todo management':
        await this.pageObjects.dashboardPage.addTodo('Performance test todo');
        break;
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    this.setTestData(`${workflowType}Duration`, duration);
  }
});

When('the user navigates through the complete application:', async function(this: CustomWorld, dataTable) {
  const accessibilityFeatures = dataTable.hashes();
  
  // Navigate using keyboard only
  await this.page.keyboard.press('Tab');
  await this.page.keyboard.press('Enter');
  
  // Check for screen reader compatibility
  const ariaLabels = await this.pageObjects.dashboardPage.getAllAriaLabels();
  this.setTestData('ariaLabels', ariaLabels);
});

When('the user performs the complete shopping workflow on mobile:', async function(this: CustomWorld, dataTable) {
  const mobileFeatures = dataTable.hashes();
  
  // Test touch interactions
  await this.pageObjects.dashboardPage.performTouchInteractions();
  
  // Test responsive design
  await this.pageObjects.dashboardPage.testResponsiveLayout();
});

When('the user uses the application normally', async function(this: CustomWorld) {
  await this.pageObjects.loginPage.login('demo', 'password');
  await this.pageObjects.dashboardPage.addProductToCart('スマートフォン', 1);
  await this.pageObjects.dashboardPage.addTodo('Security test todo');
});

When('students perform comprehensive testing:', async function(this: CustomWorld, dataTable) {
  const learningGoals = dataTable.hashes();
  
  // Demonstrate different testing techniques
  for (const goal of learningGoals) {
    const learningGoal = goal['Learning Goal'];
    const technique = goal['Testing Technique Demonstrated'];
    
    switch (learningGoal) {
      case 'Test Design':
        await this.demonstrateTestDesignTechniques();
        break;
      case 'Test Automation':
        await this.demonstrateAutomationTechniques();
        break;
      case 'Integration':
        await this.demonstrateIntegrationTesting();
        break;
      case 'Data Management':
        await this.demonstrateDataTesting();
        break;
      case 'User Experience':
        await this.demonstrateUXTesting();
        break;
    }
  }
});

// Then Steps - Verification and Assertions
Then('all UI elements should be displayed in English', async function(this: CustomWorld) {
  const uiTexts = await this.pageObjects.dashboardPage.getUITextsInCurrentLanguage();
  expect(uiTexts.loginButton, 'Login button should be in English').toContain('Login');
  expect(uiTexts.searchPlaceholder, 'Search should be in English').toContain('Search');
});

Then('the user should successfully access the dashboard', async function(this: CustomWorld) {
  const isDashboardVisible = await this.pageObjects.dashboardPage.isDashboardVisible();
  expect(isDashboardVisible, 'Dashboard should be accessible').toBe(true);
});

Then('the username {string} should be displayed in the header', async function(this: CustomWorld, expectedUsername: string) {
  const displayedUsername = await this.pageObjects.dashboardPage.getDisplayedUsername();
  expect(displayedUsername, 'Username should be displayed').toBe(expectedUsername);
});

Then('only {string} should be displayed in the results', async function(this: CustomWorld, expectedProduct: string) {
  const searchResults = await this.pageObjects.dashboardPage.getSearchResults();
  expect(searchResults.length, 'Should have exactly one result').toBe(1);
  expect(searchResults[0], 'Should display expected product').toContain(expectedProduct);
});

Then('the search and filter should work together correctly', async function(this: CustomWorld) {
  const searchTerm = this.getTestData('searchTerm');
  const appliedFilter = this.getTestData('appliedFilter');
  
  const results = await this.pageObjects.dashboardPage.getSearchResults();
  const isSearchAndFilterWorking = results.every(result => 
    result.toLowerCase().includes(searchTerm.toLowerCase()) &&
    this.isProductInCategory(result, appliedFilter)
  );
  
  expect(isSearchAndFilterWorking, 'Search and filter should work together').toBe(true);
});

Then('the cart should contain:', async function(this: CustomWorld, dataTable) {
  const expectedItems = dataTable.hashes();
  const cartItems = await this.pageObjects.dashboardPage.getCartItems();
  
  expect(cartItems.length, 'Cart should have expected number of items').toBe(expectedItems.length);
  
  for (const expectedItem of expectedItems) {
    const actualItem = cartItems.find(item => item.name === expectedItem.Product);
    expect(actualItem, `Cart should contain ${expectedItem.Product}`).toBeDefined();
    expect(actualItem?.quantity, 'Quantity should match').toBe(parseInt(expectedItem.Quantity));
  }
});

Then('the cart item count should show {string}', async function(this: CustomWorld, expectedCount: string) {
  const actualCount = await this.pageObjects.dashboardPage.getCartItemCount();
  expect(actualCount, 'Cart item count should match').toBe(parseInt(expectedCount));
});

Then('the todo item should be visible in the todo section', async function(this: CustomWorld) {
  const lastAddedTodo = this.getTestData('lastAddedTodo');
  const todos = await this.pageObjects.dashboardPage.getAllTodos();
  const todoExists = todos.some(todo => todo.text === lastAddedTodo);
  expect(todoExists, 'Todo should be visible').toBe(true);
});

Then('the item should be in uncompleted state', async function(this: CustomWorld) {
  const lastAddedTodo = this.getTestData('lastAddedTodo');
  const todos = await this.pageObjects.dashboardPage.getAllTodos();
  const todo = todos.find(todo => todo.text === lastAddedTodo);
  expect(todo?.completed, 'Todo should be uncompleted').toBe(false);
});

Then('the purchase should be completed successfully', async function(this: CustomWorld) {
  const isCheckoutCompleted = this.getTestData('checkoutCompleted');
  expect(isCheckoutCompleted, 'Purchase should be completed').toBe(true);
  
  const hasCheckoutConfirmation = await this.pageObjects.dashboardPage.hasCheckoutConfirmation();
  expect(hasCheckoutConfirmation, 'Checkout confirmation should be shown').toBe(true);
});

Then('the cart should be emptied', async function(this: CustomWorld) {
  const cartItemCount = await this.pageObjects.dashboardPage.getCartItemCount();
  expect(cartItemCount, 'Cart should be empty after checkout').toBe(0);
});

Then('the purchase history should be recorded', async function(this: CustomWorld) {
  const hasPurchaseHistory = await this.pageObjects.dashboardPage.hasPurchaseHistory();
  expect(hasPurchaseHistory, 'Purchase history should be recorded').toBe(true);
});

Then('the login state should be maintained', async function(this: CustomWorld) {
  const isLoggedIn = await this.pageObjects.loginPage.isUserAlreadyLoggedIn();
  expect(isLoggedIn, 'Login state should be maintained').toBe(true);
});

Then('the language setting \\(English) should be preserved', async function(this: CustomWorld) {
  const currentLanguage = await this.pageObjects.dashboardPage.getCurrentLanguage();
  expect(currentLanguage, 'Language should be preserved').toBe('en');
});

Then('the todo list should be maintained', async function(this: CustomWorld) {
  const todos = await this.pageObjects.dashboardPage.getAllTodos();
  expect(todos.length, 'Todo list should be maintained').toBeGreaterThan(0);
});

Then('the purchase history should be available', async function(this: CustomWorld) {
  const hasPurchaseHistory = await this.pageObjects.dashboardPage.hasPurchaseHistory();
  expect(hasPurchaseHistory, 'Purchase history should be available').toBe(true);
});

Then('all operations should complete successfully', async function(this: CustomWorld) {
  // Verify that all operations completed without errors
  const hasErrors = await this.pageObjects.dashboardPage.hasOperationErrors();
  expect(hasErrors, 'All operations should complete successfully').toBe(false);
});

Then('all data should be accurately saved in localStorage', async function(this: CustomWorld) {
  const localStorageData = await this.getLocalStorageState();
  expect(localStorageData.cart, 'Cart data should be saved').toBeDefined();
  expect(localStorageData.todos, 'Todo data should be saved').toBeDefined();
  expect(localStorageData.language, 'Language data should be saved').toBeDefined();
});

Then('the previous session should be restored automatically', async function(this: CustomWorld) {
  const returningCustomerData = this.getTestData('returningCustomerData');
  
  const isLoggedIn = await this.pageObjects.loginPage.isUserAlreadyLoggedIn();
  expect(isLoggedIn, 'Login state should be restored').toBe(true);
  
  const cartItems = await this.pageObjects.dashboardPage.getCartItems();
  expect(cartItems.length, 'Cart should be restored').toBe(returningCustomerData.cart.length);
});

Then('the user should see their previous cart contents', async function(this: CustomWorld) {
  const cartItems = await this.pageObjects.dashboardPage.getCartItems();
  expect(cartItems.length, 'Previous cart contents should be visible').toBeGreaterThan(0);
});

Then('the language preference should be restored', async function(this: CustomWorld) {
  const currentLanguage = await this.pageObjects.dashboardPage.getCurrentLanguage();
  const expectedLanguage = this.getTestData('returningCustomerData').language;
  expect(currentLanguage, 'Language preference should be restored').toBe(expectedLanguage);
});

Then('all product operations should work smoothly', async function(this: CustomWorld) {
  const isProductCatalogResponsive = await this.pageObjects.dashboardPage.isProductCatalogResponsive();
  expect(isProductCatalogResponsive, 'Product operations should work smoothly').toBe(true);
});

Then('the user should be able to compare products effectively', async function(this: CustomWorld) {
  const canCompareProducts = await this.pageObjects.dashboardPage.canCompareProducts();
  expect(canCompareProducts, 'User should be able to compare products').toBe(true);
});

Then('all wishlist items should be tracked properly', async function(this: CustomWorld) {
  const wishlistItems = this.getTestData('wishlistItems');
  const todos = await this.pageObjects.dashboardPage.getAllTodos();
  
  for (const item of wishlistItems) {
    const todoExists = todos.some(todo => todo.text.includes(item.Product));
    expect(todoExists, `Wishlist item ${item.Product} should be tracked`).toBe(true);
  }
});

Then('the user should be able to manage priorities', async function(this: CustomWorld) {
  const canManagePriorities = await this.pageObjects.dashboardPage.canManageTodoPriorities();
  expect(canManagePriorities, 'User should be able to manage priorities').toBe(true);
});

Then('the purchase process should be intuitive', async function(this: CustomWorld) {
  const isCheckoutIntuitive = await this.pageObjects.dashboardPage.isCheckoutProcessIntuitive();
  expect(isCheckoutIntuitive, 'Purchase process should be intuitive').toBe(true);
});

Then('the wishlist should be updated accordingly', async function(this: CustomWorld) {
  const todos = await this.pageObjects.dashboardPage.getAllTodos();
  const cartItems = await this.pageObjects.dashboardPage.getCartItems();
  
  // Verify that high-priority items were moved to cart
  const hasHighPriorityInCart = cartItems.some(item => item.name.includes('Wireless Earphones'));
  expect(hasHighPriorityInCart, 'High priority items should be in cart').toBe(true);
});

Then('each feature should work correctly', async function(this: CustomWorld) {
  // Test each feature independently
  const isSearchWorking = await this.pageObjects.dashboardPage.isSearchFunctionWorking();
  const isCartWorking = await this.pageObjects.dashboardPage.isCartFunctionWorking();
  const isTodoWorking = await this.pageObjects.dashboardPage.isTodoFunctionWorking();
  const isLanguageWorking = await this.pageObjects.dashboardPage.isLanguageSwitchWorking();
  
  expect(isSearchWorking, 'Search feature should work').toBe(true);
  expect(isCartWorking, 'Cart feature should work').toBe(true);
  expect(isTodoWorking, 'Todo feature should work').toBe(true);
  expect(isLanguageWorking, 'Language feature should work').toBe(true);
});

Then('features should not interfere with each other', async function(this: CustomWorld) {
  const hasFeatureInterference = await this.pageObjects.dashboardPage.hasFeatureInterference();
  expect(hasFeatureInterference, 'Features should not interfere').toBe(false);
});

Then('data consistency should be maintained across features', async function(this: CustomWorld) {
  const isDataConsistent = await this.pageObjects.dashboardPage.isDataConsistentAcrossFeatures();
  expect(isDataConsistent, 'Data should be consistent across features').toBe(true);
});

Then('the application should recover gracefully', async function(this: CustomWorld) {
  const hasRecoveredGracefully = await this.pageObjects.dashboardPage.hasRecoveredFromErrors();
  expect(hasRecoveredGracefully, 'Application should recover gracefully').toBe(true);
});

Then('user data should be preserved where possible', async function(this: CustomWorld) {
  const isDataPreserved = await this.pageObjects.dashboardPage.isUserDataPreserved();
  expect(isDataPreserved, 'User data should be preserved').toBe(true);
});

Then('clear error messages should guide the user', async function(this: CustomWorld) {
  const hasErrorMessages = await this.pageObjects.dashboardPage.hasClearErrorMessages();
  expect(hasErrorMessages, 'Error messages should guide user').toBe(true);
});

Then('all operations should meet performance criteria', async function(this: CustomWorld) {
  const loginDuration = this.getTestData('LoginDuration');
  const cartDuration = this.getTestData('Cart operationsDuration');
  const languageDuration = this.getTestData('Language switchingDuration');
  
  expect(loginDuration, 'Login should be fast').toBeLessThan(2000);
  expect(cartDuration, 'Cart operations should be responsive').toBeLessThan(1000);
  expect(languageDuration, 'Language switching should be quick').toBeLessThan(1000);
});

Then('the user experience should remain smooth', async function(this: CustomWorld) {
  const isExperienceSmooth = await this.pageObjects.dashboardPage.isUserExperienceSmooth();
  expect(isExperienceSmooth, 'User experience should be smooth').toBe(true);
});

Then('no significant delays should occur', async function(this: CustomWorld) {
  const hasSignificantDelays = await this.pageObjects.dashboardPage.hasSignificantDelays();
  expect(hasSignificantDelays, 'No significant delays should occur').toBe(false);
});

Then('the application should be fully accessible', async function(this: CustomWorld) {
  const isFullyAccessible = await this.pageObjects.dashboardPage.isFullyAccessible();
  expect(isFullyAccessible, 'Application should be fully accessible').toBe(true);
});

Then('users with disabilities should be able to complete all tasks', async function(this: CustomWorld) {
  const ariaLabels = this.getTestData('ariaLabels');
  expect(ariaLabels.length, 'Should have accessibility labels').toBeGreaterThan(0);
});

Then('accessibility standards should be met', async function(this: CustomWorld) {
  const meetsAccessibilityStandards = await this.pageObjects.dashboardPage.meetsAccessibilityStandards();
  expect(meetsAccessibilityStandards, 'Should meet accessibility standards').toBe(true);
});

Then('the mobile experience should be fully functional', async function(this: CustomWorld) {
  const isMobileDevice = this.getTestData('isMobileDevice');
  expect(isMobileDevice, 'Should be in mobile context').toBe(true);
  
  const isMobileFunctional = await this.pageObjects.dashboardPage.isMobileExperienceFunctional();
  expect(isMobileFunctional, 'Mobile experience should be functional').toBe(true);
});

Then('all features should work properly on mobile', async function(this: CustomWorld) {
  const mobileFeatureTests = await this.pageObjects.dashboardPage.testAllFeaturesOnMobile();
  expect(mobileFeatureTests.allWorking, 'All features should work on mobile').toBe(true);
});

Then('the responsive design should adapt appropriately', async function(this: CustomWorld) {
  const isResponsiveDesignWorking = await this.pageObjects.dashboardPage.isResponsiveDesignWorking();
  expect(isResponsiveDesignWorking, 'Responsive design should work').toBe(true);
});

Then('no sensitive information should be exposed', async function(this: CustomWorld) {
  const hasSensitiveInfoExposed = await this.pageObjects.dashboardPage.hasSensitiveInfoExposed();
  expect(hasSensitiveInfoExposed, 'No sensitive info should be exposed').toBe(false);
});

Then('XSS attacks should be prevented in all input fields', async function(this: CustomWorld) {
  const isXSSPrevented = await this.pageObjects.dashboardPage.isXSSPrevented();
  expect(isXSSPrevented, 'XSS should be prevented').toBe(true);
});

Then('localStorage should not contain sensitive data in plain text', async function(this: CustomWorld) {
  const hasPlaintextSensitiveData = await this.pageObjects.dashboardPage.hasPlaintextSensitiveDataInStorage();
  expect(hasPlaintextSensitiveData, 'No plaintext sensitive data in storage').toBe(false);
});

Then('the application should follow security best practices', async function(this: CustomWorld) {
  const followsSecurityBestPractices = await this.pageObjects.dashboardPage.followsSecurityBestPractices();
  expect(followsSecurityBestPractices, 'Should follow security best practices').toBe(true);
});

Then('all major testing techniques should be demonstrable', async function(this: CustomWorld) {
  const educationalMode = this.getTestData('educationalMode');
  expect(educationalMode, 'Should be in educational mode').toBe(true);
  
  const areDemonstrableTechniques = await this.verifyTestingTechniquesAreDemonstrable();
  expect(areDemonstrableTechniques, 'Testing techniques should be demonstrable').toBe(true);
});

Then('students should gain practical E2E testing experience', async function(this: CustomWorld) {
  const practicalExperienceAvailable = await this.pageObjects.dashboardPage.isPracticalExperienceAvailable();
  expect(practicalExperienceAvailable, 'Practical experience should be available').toBe(true);
});

Then('real-world testing scenarios should be covered', async function(this: CustomWorld) {
  const realWorldScenariosAvailable = await this.pageObjects.dashboardPage.areRealWorldScenariosAvailable();
  expect(realWorldScenariosAvailable, 'Real-world scenarios should be covered').toBe(true);
});

// Helper Methods for Complex Scenarios
private async demonstrateTestDesignTechniques() {
  // Demonstrate equivalence partitioning and boundary analysis
  await this.pageObjects.dashboardPage.testBoundaryValues();
  await this.pageObjects.dashboardPage.testEquivalenceClasses();
}

private async demonstrateAutomationTechniques() {
  // Demonstrate Page Object Model and BDD
  await this.pageObjects.dashboardPage.demonstratePageObjectModel();
  await this.pageObjects.dashboardPage.demonstrateBDDApproach();
}

private async demonstrateIntegrationTesting() {
  // Demonstrate cross-feature testing
  await this.pageObjects.dashboardPage.testFeatureIntegration();
}

private async demonstrateDataTesting() {
  // Demonstrate persistence and state testing
  await this.pageObjects.dashboardPage.testDataPersistence();
  await this.pageObjects.dashboardPage.testStateManagement();
}

private async demonstrateUXTesting() {
  // Demonstrate end-to-end user scenarios
  await this.pageObjects.dashboardPage.testCompleteUserJourneys();
}

private async verifyTestingTechniquesAreDemonstrable(): Promise<boolean> {
  // Verify that the application supports demonstrating various testing techniques
  return await this.pageObjects.dashboardPage.canDemonstrateTestingTechniques();
}

private isProductInCategory(productName: string, category: string): boolean {
  // Helper method to check if product belongs to category
  const categoryMappings: { [key: string]: string[] } = {
    'electronics': ['smartphone', 'laptop', 'スマートフォン', 'ノートパソコン'],
    'clothing': ['t-shirt', 'jeans', 'tシャツ', 'ジーンズ'],
    'books': ['programming', 'javascript', 'プログラミング']
  };
  
  const productsInCategory = categoryMappings[category.toLowerCase()] || [];
  return productsInCategory.some(categoryProduct => 
    productName.toLowerCase().includes(categoryProduct.toLowerCase())
  );
}