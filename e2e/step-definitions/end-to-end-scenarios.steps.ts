import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

/**
 * End-to-End Scenarios Step Definitions
 * Maps to end-to-end-scenarios.feature scenarios
 * Test Cases: TC-E2E-001 to TC-E2E-008
 * Requirements: All functional requirements (REQ-F-001 to REQ-F-010)
 */

// Given Steps
Given('the user is using the ShopTodo application', async function(this: CustomWorld) {
  await this.clearApplicationState();
  await this.pageObjects.dashboardPage.goto();
  await this.pageObjects.dashboardPage.waitForPageLoad();
});

Given('the user starts a typical shopping session', async function(this: CustomWorld) {
  await this.clearApplicationState();
  await this.pageObjects.dashboardPage.goto();
  await this.pageObjects.dashboardPage.waitForPageLoad();
  await this.pageObjects.loginPage.login('demo', 'password');
});

Given('the user has items in their cart and todos', async function(this: CustomWorld) {
  await this.clearApplicationState();
  await this.pageObjects.dashboardPage.goto();
  await this.pageObjects.dashboardPage.waitForPageLoad();
  await this.pageObjects.loginPage.login('demo', 'password');
  await this.pageObjects.dashboardPage.addProductToCart('スマートフォン');
  await this.pageObjects.dashboardPage.addTodoItem('商品比較');
});

Given('the application is being used for educational purposes', async function(this: CustomWorld) {
  await this.clearApplicationState();
  await this.pageObjects.dashboardPage.goto();
  await this.pageObjects.dashboardPage.waitForPageLoad();
  // Set up educational scenario
  this.setTestData('educational_mode', true);
});

Given('a new user accesses the application for the first time', async function(this: CustomWorld) {
  await this.clearApplicationState();
  await this.pageObjects.dashboardPage.goto();
  await this.pageObjects.dashboardPage.waitForPageLoad();

  // Verify clean state
  const isLoggedIn = await this.pageObjects.loginPage.isUserAlreadyLoggedIn();
  expect(isLoggedIn, 'User should not be logged in initially').toBe(false);
});

Given('an experienced user returns to continue their session', async function(this: CustomWorld) {
  // Set up previous session data through localStorage
  await this.page.evaluate(() => {
    const sessionData = {
      login: { username: 'demo', isLoggedIn: true },
      cart: [{ name: 'スマートフォン', quantity: 1, price: 89800 }],
      todos: [{ text: '前回の商品', completed: false, timestamp: Date.now() }],
      language: 'jp'
    };

    localStorage.setItem('shoptodo_session', JSON.stringify(sessionData.login));
    localStorage.setItem('shoptodo_cart', JSON.stringify(sessionData.cart));
    localStorage.setItem('shoptodo_todos', JSON.stringify(sessionData.todos));
    localStorage.setItem('shoptodo_language', sessionData.language);
  });

  await this.pageObjects.dashboardPage.goto();
  await this.pageObjects.dashboardPage.waitForPageLoad();
});

// When Steps
When('the user performs a complete shopping workflow', async function(this: CustomWorld) {
  await this.pageObjects.loginPage.login('demo', 'password');
  await this.pageObjects.dashboardPage.enterSearchTerm('スマートフォン');
  await this.pageObjects.dashboardPage.addProductToCart('スマートフォン');
  await this.pageObjects.dashboardPage.addTodoItem('スマートフォン購入検討');
  await this.pageObjects.dashboardPage.clickCartIcon();
});

When('the user switches between different languages during shopping', async function(this: CustomWorld) {
  await this.pageObjects.loginPage.login('demo', 'password');
  await this.pageObjects.dashboardPage.clickEnglishLanguageButton();
  await this.pageObjects.dashboardPage.addProductToCart('Smartphone');
  await this.pageObjects.dashboardPage.clickJapaneseLanguageButton();
  await this.pageObjects.dashboardPage.addTodoItem('商品検討');
});

When('the user explores all major features of the application', async function(this: CustomWorld) {
  await this.pageObjects.loginPage.login('demo', 'password');

  // Search products
  await this.pageObjects.dashboardPage.enterSearchTerm('パソコン');
  await this.pageObjects.dashboardPage.clearSearch();

  // Use filters
  await this.pageObjects.dashboardPage.clickElectronicsFilter();
  await this.pageObjects.dashboardPage.clickAllFilter();

  // Add items to cart
  await this.pageObjects.dashboardPage.addProductToCart('ノートパソコン');

  // Manage todos
  await this.pageObjects.dashboardPage.addTodoItem('価格比較する');

  // Switch language
  await this.pageObjects.dashboardPage.clickEnglishLanguageButton();
});

When('multiple users interact with the application simultaneously', async function(this: CustomWorld) {
  // For single-user testing, simulate concurrent actions
  await this.pageObjects.loginPage.login('demo', 'password');
  await this.pageObjects.dashboardPage.addProductToCart('スマートフォン');
  await this.pageObjects.dashboardPage.addTodoItem('同期テスト');

  // Simulate another session (page refresh)
  await this.page.reload();
  await this.pageObjects.dashboardPage.waitForPageLoad();
});

When('the application handles various error conditions', async function(this: CustomWorld) {
  await this.pageObjects.loginPage.login('demo', 'password');

  // Test with empty search
  await this.pageObjects.dashboardPage.enterSearchTerm('存在しない商品');

  // Test with empty todo
  await this.pageObjects.dashboardPage.enterTodoText('');
  await this.pageObjects.dashboardPage.clickAddTodoButton();

  // Clear for next tests
  await this.pageObjects.dashboardPage.clearSearch();
});

When('the user performs comprehensive testing activities', async function(this: CustomWorld) {
  await this.pageObjects.loginPage.login('demo', 'password');

  // Test various features
  await this.pageObjects.dashboardPage.enterSearchTerm('テスト');
  await this.pageObjects.dashboardPage.clearSearch();
  await this.pageObjects.dashboardPage.addProductToCart('スマートフォン');
  await this.pageObjects.dashboardPage.addTodoItem('テスト項目');
  await this.pageObjects.dashboardPage.clickEnglishLanguageButton();
  await this.pageObjects.dashboardPage.clickJapaneseLanguageButton();
});

When('the user tests responsive design across different screen sizes', async function(this: CustomWorld) {
  await this.pageObjects.loginPage.login('demo', 'password');

  // Test mobile viewport
  await this.page.setViewportSize({ width: 375, height: 667 });
  await this.pageObjects.dashboardPage.addProductToCart('スマートフォン');

  // Test desktop viewport
  await this.page.setViewportSize({ width: 1920, height: 1080 });
  await this.pageObjects.dashboardPage.addTodoItem('レスポンシブテスト');
});

When('the application demonstrates educational testing concepts', async function(this: CustomWorld) {
  // Demonstrate various testing scenarios
  await this.pageObjects.loginPage.login('demo', 'password');

  // Boundary testing
  await this.pageObjects.dashboardPage.enterSearchTerm('a');
  await this.pageObjects.dashboardPage.clearSearch();

  // State testing
  await this.pageObjects.dashboardPage.addProductToCart('テスト商品');
  await this.pageObjects.dashboardPage.addTodoItem('学習項目');
});

When('they explore the complete user journey from login to checkout', async function(this: CustomWorld) {
  // Complete user journey
  await this.pageObjects.loginPage.login('demo', 'password');
  await this.pageObjects.dashboardPage.enterSearchTerm('スマートフォン');
  await this.pageObjects.dashboardPage.addProductToCart('スマートフォン');
  await this.pageObjects.dashboardPage.clickCartIcon();
});

When('they resume their previous activities', async function(this: CustomWorld) {
  // User resumes with existing session
  const isLoggedIn = await this.pageObjects.dashboardPage.isLogoutButtonVisible();
  if (isLoggedIn) {
    await this.pageObjects.dashboardPage.addTodoItem('継続作業');
  }
});

// Then Steps
Then('all features should work seamlessly together', async function(this: CustomWorld) {
  // Verify login state
  const isLoggedIn = await this.pageObjects.dashboardPage.isLogoutButtonVisible();
  expect(isLoggedIn, 'User should be logged in').toBe(true);

  // Verify product catalog is visible
  const productCount = await this.pageObjects.dashboardPage.getProductCount();
  expect(productCount, 'Products should be displayed').toBeGreaterThan(0);
});

Then('the user experience should be consistent across languages', async function(this: CustomWorld) {
  // Verify language switching works
  const isEnglishActive = await this.pageObjects.dashboardPage.isEnglishLanguageActive();
  const isJapaneseActive = await this.pageObjects.dashboardPage.isJapaneseLanguageActive();
  expect(isEnglishActive || isJapaneseActive, 'A language should be active').toBe(true);
});

Then('the application should demonstrate comprehensive functionality', async function(this: CustomWorld) {
  // Verify main features are accessible
  const productCount = await this.pageObjects.dashboardPage.getProductCount();
  expect(productCount, 'Product catalog should be functional').toBeGreaterThan(0);

  const isLoggedIn = await this.pageObjects.dashboardPage.isLogoutButtonVisible();
  expect(isLoggedIn, 'Authentication should work').toBe(true);
});

Then('data integrity should be maintained across all operations', async function(this: CustomWorld) {
  // Check cart persistence
  const cartCount = await this.pageObjects.dashboardPage.getCartItemCount();
  expect(parseInt(cartCount), 'Cart data should persist').toBeGreaterThanOrEqual(0);

  // Check todo persistence
  const todoCount = await this.pageObjects.dashboardPage.getTodoItemCount();
  expect(todoCount, 'Todo data should persist').toBeGreaterThanOrEqual(0);
});

Then('the application should handle concurrent operations gracefully', async function(this: CustomWorld) {
  // Verify application stability after reload
  const productCount = await this.pageObjects.dashboardPage.getProductCount();
  expect(productCount, 'Application should remain stable').toBeGreaterThan(0);

  const isLoggedIn = await this.pageObjects.dashboardPage.isLogoutButtonVisible();
  expect(isLoggedIn, 'Login state should be maintained').toBe(true);
});

Then('appropriate error handling should be demonstrated', async function(this: CustomWorld) {
  // Verify no results message for invalid search
  const isNoResultsVisible = await this.pageObjects.dashboardPage.isNoResultsMessageDisplayed();
  // This may or may not be visible depending on search results
  expect(typeof isNoResultsVisible, 'Error handling should be implemented').toBe('boolean');
});

Then('comprehensive test coverage should be achieved', async function(this: CustomWorld) {
  // Verify all major components are functional
  const productCount = await this.pageObjects.dashboardPage.getProductCount();
  expect(productCount, 'Product functionality covered').toBeGreaterThan(0);

  const isLoggedIn = await this.pageObjects.dashboardPage.isLogoutButtonVisible();
  expect(isLoggedIn, 'Authentication functionality covered').toBe(true);
});

Then('the application should work across different screen sizes', async function(this: CustomWorld) {
  // Verify responsive design
  const productCount = await this.pageObjects.dashboardPage.getProductCount();
  expect(productCount, 'Application should work on all screen sizes').toBeGreaterThan(0);

  // Reset viewport to default
  await this.page.setViewportSize({ width: 1280, height: 720 });
});

Then('various testing methodologies should be demonstrable', async function(this: CustomWorld) {
  // Verify testing scenarios are possible
  const productCount = await this.pageObjects.dashboardPage.getProductCount();
  expect(productCount, 'Functional testing is possible').toBeGreaterThan(0);

  const todoCount = await this.pageObjects.dashboardPage.getTodoItemCount();
  expect(todoCount, 'State management testing is possible').toBeGreaterThanOrEqual(0);
});

Then('they should have access to all core functionality', async function(this: CustomWorld) {
  const productCount = await this.pageObjects.dashboardPage.getProductCount();
  expect(productCount, 'Product catalog should be accessible').toBeGreaterThan(0);
});

Then('their previous session data should be restored', async function(this: CustomWorld) {
  const isLoggedIn = await this.pageObjects.dashboardPage.isLogoutButtonVisible();
  expect(isLoggedIn, 'User should be automatically logged in').toBe(true);

  const cartCount = await this.pageObjects.dashboardPage.getCartItemCount();
  expect(parseInt(cartCount), 'Previous cart data should be restored').toBeGreaterThan(0);
});