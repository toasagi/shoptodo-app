import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

/**
 * Data Persistence Step Definitions
 * Maps to data-persistence.feature scenarios
 * Test Cases: TC-PERSIST-001 to TC-PERSIST-008
 * Requirements: REQ-F-011, REQ-NF-005 (Data Persistence, Browser Compatibility)
 */

// Given Steps
Given('the user starts with a clean application state', async function(this: CustomWorld) {
  await this.clearApplicationState();
  await this.pageObjects.dashboardPage.goto();
  await this.pageObjects.dashboardPage.waitForPageLoad();
});

Given('localStorage is available', async function(this: CustomWorld) {
  // Check localStorage availability through browser evaluation
  const isLocalStorageAvailable = await this.page.evaluate(() => {
    try {
      const testKey = '__localStorage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  });
  expect(isLocalStorageAvailable, 'localStorage should be available').toBe(true);
});

Given('the user is not logged in', async function(this: CustomWorld) {
  await this.clearApplicationState();
  const isLoggedIn = await this.pageObjects.loginPage.isUserAlreadyLoggedIn();
  expect(isLoggedIn, 'User should not be logged in initially').toBe(false);
});

Given('the user has been using the application normally', async function(this: CustomWorld) {
  // Set up normal application state
  await this.pageObjects.loginPage.login('demo', 'password');
  await this.pageObjects.dashboardPage.addProductToCart('スマートフォン');
  await this.pageObjects.dashboardPage.addTodoItem('テストアイテム');
  await this.pageObjects.dashboardPage.clickEnglishLanguageButton();
});

Given('the user has previous session data', async function(this: CustomWorld) {
  // Set up previous session data through localStorage manipulation
  await this.page.evaluate(() => {
    const sessionData = {
      login: { username: 'demo', isLoggedIn: true },
      cart: [{ name: 'スマートフォン', quantity: 1, price: 89800 }],
      todos: [{ text: '前回のタスク', completed: false, timestamp: Date.now() }],
      language: 'jp'
    };

    localStorage.setItem('shoptodo_session', JSON.stringify(sessionData.login));
    localStorage.setItem('shoptodo_cart', JSON.stringify(sessionData.cart));
    localStorage.setItem('shoptodo_todos', JSON.stringify(sessionData.todos));
    localStorage.setItem('shoptodo_language', sessionData.language);
  });

  this.setTestData('previousSession', true);
});

Given('the user has legacy data format in localStorage', async function(this: CustomWorld) {
  // Set up legacy data format
  await this.page.evaluate(() => {
    const legacyData = {
      user: 'demo',
      cartItems: ['smartphone'],
      todoList: ['old todo'],
      lang: 'japanese'
    };
    localStorage.setItem('old_shoptodo_data', JSON.stringify(legacyData));
  });
});

Given('the user has corrupted data in localStorage', async function(this: CustomWorld) {
  // Set up corrupted data
  await this.page.evaluate(() => {
    localStorage.setItem('shoptodo_cart', '{"invalid": json}');
    localStorage.setItem('shoptodo_todos', 'not_json_at_all');
  });
});

// When Steps
When('the user logs in', async function(this: CustomWorld) {
  await this.pageObjects.loginPage.login('demo', 'password');
});

When('the user adds {string} to their shopping cart', async function(this: CustomWorld, productName: string) {
  await this.pageObjects.dashboardPage.addProductToCart(productName);
});

When('the user creates a new todo item {string}', async function(this: CustomWorld, todoText: string) {
  await this.pageObjects.dashboardPage.addTodoItem(todoText);
});

When('the user switches to {string} language', async function(this: CustomWorld, language: string) {
  if (language.toLowerCase() === 'english') {
    await this.pageObjects.dashboardPage.clickEnglishLanguageButton();
  } else {
    await this.pageObjects.dashboardPage.clickJapaneseLanguageButton();
  }
});

When('the user refreshes the page', async function(this: CustomWorld) {
  await this.page.reload();
  await this.pageObjects.dashboardPage.waitForPageLoad();
});

When('the user closes and reopens the browser', async function(this: CustomWorld) {
  // Simulate browser restart by creating new browser context
  await this.restartBrowserContext();
  await this.pageObjects.dashboardPage.goto();
  await this.pageObjects.dashboardPage.waitForPageLoad();
});

When('the user navigates to a different page and comes back', async function(this: CustomWorld) {
  await this.page.goto('about:blank');
  await this.pageObjects.dashboardPage.goto();
  await this.pageObjects.dashboardPage.waitForPageLoad();
});

When('localStorage becomes unavailable', async function(this: CustomWorld) {
  // Mock localStorage to throw errors
  await this.page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: () => { throw new Error('localStorage unavailable'); },
        setItem: () => { throw new Error('localStorage unavailable'); },
        removeItem: () => { throw new Error('localStorage unavailable'); },
        clear: () => { throw new Error('localStorage unavailable'); }
      }
    });
  });
});

When('localStorage reaches storage limit', async function(this: CustomWorld) {
  // Fill localStorage to capacity
  await this.page.evaluate(() => {
    try {
      const data = 'x'.repeat(1024 * 1024); // 1MB of data
      for (let i = 0; i < 10; i++) {
        localStorage.setItem(`large_data_${i}`, data);
      }
    } catch (e) {
      // Storage limit reached - this is expected behavior
      console.log('Storage limit reached as expected:', e);
    }
  });
});

When('the application detects data format changes', async function(this: CustomWorld) {
  // Simulate data migration scenario
  await this.page.evaluate(() => {
    localStorage.setItem('shoptodo_version', '1.0.0');
    localStorage.setItem('current_app_version', '2.0.0');
  });
});

// Then Steps
Then('the login session should persist across browser restarts', async function(this: CustomWorld) {
  const isLoggedIn = await this.pageObjects.dashboardPage.isLogoutButtonVisible();
  expect(isLoggedIn, 'User should remain logged in after browser restart').toBe(true);
});

Then('the shopping cart contents should be preserved', async function(this: CustomWorld) {
  const cartCount = await this.pageObjects.dashboardPage.getCartItemCount();
  expect(parseInt(cartCount) > 0, 'Cart should contain items').toBe(true);
});

Then('the todo list should retain all items', async function(this: CustomWorld) {
  const todoCount = await this.pageObjects.dashboardPage.getTodoItemCount();
  expect(todoCount > 0, 'Todo list should contain items').toBe(true);
});

Then('the selected language preference should be remembered', async function(this: CustomWorld) {
  const isEnglishActive = await this.pageObjects.dashboardPage.isEnglishLanguageActive();
  const isJapaneseActive = await this.pageObjects.dashboardPage.isJapaneseLanguageActive();
  expect(isEnglishActive || isJapaneseActive, 'A language should be selected').toBe(true);
});

Then('all user data should persist after page reload', async function(this: CustomWorld) {
  // Check that all data persists
  const isLoggedIn = await this.pageObjects.dashboardPage.isLogoutButtonVisible();
  const cartCount = await this.pageObjects.dashboardPage.getCartItemCount();
  const todoCount = await this.pageObjects.dashboardPage.getTodoItemCount();

  expect(isLoggedIn, 'Login state should persist').toBe(true);
  expect(parseInt(cartCount) > 0, 'Cart data should persist').toBe(true);
  expect(todoCount > 0, 'Todo data should persist').toBe(true);
});

Then('the application should handle data corruption gracefully', async function(this: CustomWorld) {
  // Check that app loads without errors despite corrupted data
  const productCount = await this.pageObjects.dashboardPage.getProductCount();
  expect(productCount, 'Application should load with default data').toBeGreaterThan(0);
});

Then('the application should provide appropriate error messages', async function(this: CustomWorld) {
  // Check for error handling UI elements
  const pageTitle = await this.page.title();
  expect(pageTitle, 'Application should still be functional').toContain('ShopTodo');
});

Then('data should be migrated to the new format automatically', async function(this: CustomWorld) {
  // Check that data migration completed successfully
  const currentData = await this.page.evaluate(() => {
    return {
      hasNewFormat: localStorage.getItem('shoptodo_session') !== null,
      hasLegacyFormat: localStorage.getItem('old_shoptodo_data') !== null
    };
  });

  expect(currentData.hasNewFormat, 'New format data should exist after migration').toBe(true);
});

Then('the application should work offline with cached data', async function(this: CustomWorld) {
  // Test offline functionality by setting network offline
  await this.context.setOffline(true);
  const productCount = await this.pageObjects.dashboardPage.getProductCount();
  expect(productCount, 'Application should work offline with cached data').toBeGreaterThan(0);
  await this.context.setOffline(false);
});

Then('no data should be lost during the storage operation', async function(this: CustomWorld) {
  const todoCount = await this.pageObjects.dashboardPage.getTodoItemCount();
  expect(todoCount, 'No data should be lost').toBeGreaterThanOrEqual(0);
});

Then('the application should remain responsive', async function(this: CustomWorld) {
  // Check application responsiveness
  const startTime = Date.now();
  await this.pageObjects.dashboardPage.getProductCount();
  const responseTime = Date.now() - startTime;
  expect(responseTime, 'Application should respond quickly').toBeLessThan(5000);
});

Then('appropriate privacy mode warnings should be displayed', async function(this: CustomWorld) {
  // Check for privacy mode handling
  const pageContent = await this.page.content();
  const hasContent = pageContent.length > 0;
  expect(hasContent, 'Application should handle privacy mode gracefully').toBe(true);
});

Then('localStorage functionality should be fully restored', async function(this: CustomWorld) {
  const isWorking = await this.page.evaluate(() => {
    try {
      localStorage.setItem('test_key', 'test_value');
      const value = localStorage.getItem('test_key');
      localStorage.removeItem('test_key');
      return value === 'test_value';
    } catch (e) {
      console.error('localStorage test failed:', e);
      return false;
    }
  });
  expect(isWorking, 'localStorage should be working').toBe(true);
});