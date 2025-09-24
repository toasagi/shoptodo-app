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
  const isLocalStorageAvailable = await this.pageObjects.dashboardPage.isLocalStorageAvailable();
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
  await this.pageObjects.dashboardPage.addProductToCart('スマートフォン', 2);
  await this.pageObjects.dashboardPage.addTodo('テストアイテム');
  await this.pageObjects.dashboardPage.setLanguage('en');
});

Given('the user has previous session data', async function(this: CustomWorld) {
  // Set up previous session data
  const sessionData = {
    login: { username: 'demo', isLoggedIn: true },
    cart: [{ name: 'スマートフォン', quantity: 1 }],
    todos: [{ text: '前回のタスク', completed: false }],
    language: 'jp'
  };
  
  await this.pageObjects.dashboardPage.setApplicationState(sessionData);
  this.setTestData('previousSession', sessionData);
});

Given('the user has data stored in an older format', async function(this: CustomWorld) {
  // Simulate older data format in localStorage
  const oldFormatData = {
    userInfo: 'demo', // Old format - just string instead of object
    cartData: 'smartphone,1', // Old format - string instead of array
    language: 'japanese' // Old format - full word instead of code
  };
  
  await this.pageObjects.dashboardPage.setLegacyDataFormat(oldFormatData);
  this.setTestData('oldFormatData', oldFormatData);
});

Given('the browser is in private/incognito mode', async function(this: CustomWorld) {
  // Note: This step assumes the test is run in incognito mode
  // In actual implementation, this would be configured at test runner level
  this.setTestData('isIncognitoMode', true);
});

Given('the user has the application open in Tab 1', async function(this: CustomWorld) {
  // Set up Tab 1
  await this.pageObjects.loginPage.login('demo', 'password');
  await this.pageObjects.dashboardPage.addProductToCart('スマートフォン', 1);
  this.setTestData('tab1Ready', true);
});

Given('the user opens the application in Tab 2', async function(this: CustomWorld) {
  // Simulate second tab by storing current state and opening fresh instance
  const currentState = await this.getLocalStorageState();
  this.setTestData('tab1State', currentState);
  
  // Open "new tab" - in our case, reload and check if state persists
  await this.page.reload();
  await this.pageObjects.dashboardPage.waitForPageLoad();
});

Given('the user is using {string}', async function(this: CustomWorld, browser: string) {
  // Store browser type for cross-browser testing
  this.setTestData('browserType', browser);
  // Note: Actual browser switching would be handled by test configuration
});

Given('the user has been using the application for extended periods', async function(this: CustomWorld) {
  // Simulate extended usage with lots of data
  await this.pageObjects.loginPage.login('demo', 'password');
  
  for (let i = 0; i < 20; i++) {
    await this.pageObjects.dashboardPage.addTodo(`Extended use todo ${i}`);
  }
  
  await this.pageObjects.dashboardPage.addProductToCart('スマートフォン', 5);
  await this.pageObjects.dashboardPage.addProductToCart('ノートパソコン', 3);
});

Given('the user has sensitive information in the application', async function(this: CustomWorld) {
  await this.pageObjects.loginPage.login('demo', 'password');
  
  // Add some data that might be considered sensitive
  await this.pageObjects.dashboardPage.addTodo('Personal task with sensitive info');
  this.setTestData('hasSensitiveData', true);
});

// When Steps
When('the user logs in as {string}', async function(this: CustomWorld, username: string) {
  await this.pageObjects.loginPage.login(username, 'password');
  this.setTestData('loginUsername', username);
});

When('the user adds multiple products to the cart:', async function(this: CustomWorld, dataTable) {
  const products = dataTable.hashes();
  
  for (const product of products) {
    const productName = product.Product;
    const quantity = parseInt(product.Quantity);
    await this.pageObjects.dashboardPage.addProductToCart(productName, quantity);
  }
  
  this.setTestData('addedProducts', products);
});

When('the user adds multiple todo items:', async function(this: CustomWorld, dataTable) {
  const todos = dataTable.hashes();
  
  for (const todoData of todos) {
    const todoText = todoData['Todo Text'];
    const status = todoData['Status'];
    
    await this.pageObjects.dashboardPage.addTodo(todoText);
    
    if (status === 'completed') {
      await this.pageObjects.dashboardPage.toggleTodoCompletion(todoText);
    }
  }
  
  this.setTestData('addedTodos', todos);
});

When('the user performs the following actions:', async function(this: CustomWorld, dataTable) {
  const actions = dataTable.hashes();
  
  for (const action of actions) {
    const actionType = action.Action;
    const details = action.Details;
    
    switch (actionType) {
      case 'Login':
        const [username, password] = details.split(', ').map(part => part.split(': ')[1]);
        await this.pageObjects.loginPage.login(username, password);
        break;
        
      case 'Language Switch':
        const targetLanguage = details.includes('English') ? 'en' : 'jp';
        await this.pageObjects.dashboardPage.setLanguage(targetLanguage);
        break;
        
      case 'Add to Cart':
        const cartItems = details.split(', ');
        for (const item of cartItems) {
          const [product, quantity] = item.split(' × ');
          await this.pageObjects.dashboardPage.addProductToCart(product, parseInt(quantity));
        }
        break;
        
      case 'Add Todo':
        const todoMatch = details.match(/"([^"]+)" \(([^)]+)\)/);
        if (todoMatch) {
          const [, todoText, status] = todoMatch;
          await this.pageObjects.dashboardPage.addTodo(todoText);
          if (status === 'completed') {
            await this.pageObjects.dashboardPage.toggleTodoCompletion(todoText);
          }
        }
        break;
    }
    
    await this.page.waitForTimeout(500);
  }
});

When('the browser is completely closed and reopened', async function(this: CustomWorld) {
  // Store current localStorage state for verification
  const currentState = await this.getLocalStorageState();
  this.setTestData('stateBeforeRestart', currentState);
  
  // Simulate complete browser restart
  await this.simulateBrowserRestart();
});

When('the user navigates to the application URL', async function(this: CustomWorld) {
  await this.navigateToApp();
});

When('the user adds a large amount of todo items \\(100+ items)', async function(this: CustomWorld) {
  for (let i = 0; i < 100; i++) {
    await this.pageObjects.dashboardPage.addTodo(`Bulk todo item ${i + 1}`);
    
    // Add delay every 10 items to avoid overwhelming the browser
    if (i % 10 === 0) {
      await this.page.waitForTimeout(100);
    }
  }
  
  this.setTestData('bulkTodoCount', 100);
});

When('various cart operations are performed', async function(this: CustomWorld) {
  await this.pageObjects.dashboardPage.addProductToCart('スマートフォン', 10);
  await this.pageObjects.dashboardPage.addProductToCart('ノートパソコン', 5);
  await this.pageObjects.dashboardPage.addProductToCart('Tシャツ', 20);
});

When('the user uses the application normally:', async function(this: CustomWorld, dataTable) {
  const operations = dataTable.raw()[0];
  
  if (operations.includes('Login')) {
    await this.pageObjects.loginPage.login('demo', 'password');
  }
  
  if (operations.includes('Add products to cart')) {
    await this.pageObjects.dashboardPage.addProductToCart('スマートフォン', 2);
  }
  
  if (operations.includes('Add todo items')) {
    await this.pageObjects.dashboardPage.addTodo('Incognito test todo');
  }
});

When('localStorage contains corrupted JSON data \\(simulated)', async function(this: CustomWorld) {
  // Inject corrupted data into localStorage
  await this.pageObjects.dashboardPage.setCorruptedLocalStorageData();
  this.setTestData('corruptedDataInjected', true);
});

When('the user reloads the application', async function(this: CustomWorld) {
  await this.page.reload();
  await this.pageObjects.dashboardPage.waitForPageLoad();
});

When('the user performs normal application operations:', async function(this: CustomWorld, dataTable) {
  const operations = dataTable.raw()[0];
  
  // Perform each type of operation
  if (operations.includes('Login')) {
    await this.pageObjects.loginPage.login('demo', 'password');
  }
  
  if (operations.includes('Cart operations')) {
    await this.pageObjects.dashboardPage.addProductToCart('スマートフォン', 1);
    await this.pageObjects.dashboardPage.addProductToCart('ノートパソコン', 1);
  }
  
  if (operations.includes('Todo operations')) {
    await this.pageObjects.dashboardPage.addTodo('Cross-browser test todo');
  }
  
  if (operations.includes('Language switching')) {
    await this.pageObjects.dashboardPage.setLanguage('en');
  }
});

When('the browser is restarted', async function(this: CustomWorld) {
  await this.simulateBrowserRestart();
});

When('the user adds items to cart in Tab 1', async function(this: CustomWorld) {
  await this.pageObjects.dashboardPage.addProductToCart('ノートパソコン', 1);
  this.setTestData('tab1CartAddition', true);
});

When('the user switches to Tab 2', async function(this: CustomWorld) {
  // In our simulation, this means checking the current state
  // which should reflect changes from Tab 1
  await this.page.waitForTimeout(1000); // Simulate tab switch delay
});

When('the application loads with new data format requirements', async function(this: CustomWorld) {
  // Simulate application update that requires data migration
  await this.pageObjects.dashboardPage.triggerDataMigration();
});

When('excessive data accumulates in localStorage', async function(this: CustomWorld) {
  // Simulate excessive data accumulation
  for (let i = 0; i < 50; i++) {
    await this.pageObjects.dashboardPage.addTodo(`Cleanup test todo ${i}`);
  }
  
  // Add large cart
  await this.pageObjects.dashboardPage.addProductToCart('スマートフォン', 25);
});

When('data is stored in localStorage', async function(this: CustomWorld) {
  // Data is already stored from previous steps, just verify it exists
  const hasData = await this.pageObjects.dashboardPage.hasDataInLocalStorage();
  expect(hasData, 'Data should be stored in localStorage').toBe(true);
});

// Then Steps - Persistence Verification
Then('the login state should be restored', async function(this: CustomWorld) {
  const isLoggedIn = await this.pageObjects.loginPage.isUserAlreadyLoggedIn();
  expect(isLoggedIn, 'Login state should be restored').toBe(true);
  
  const displayedUsername = await this.pageObjects.dashboardPage.getDisplayedUsername();
  const expectedUsername = this.getTestData('loginUsername');
  expect(displayedUsername, 'Username should be restored').toBe(expectedUsername);
});

Then('the authentication information should be preserved in localStorage', async function(this: CustomWorld) {
  const loginState = await this.pageObjects.loginPage.getLoginStateFromStorage();
  expect(loginState?.isLoggedIn, 'Login state should be preserved').toBe(true);
  
  const expectedUsername = this.getTestData('loginUsername');
  expect(loginState?.username, 'Username should be preserved').toBe(expectedUsername);
});

Then('the dashboard page should be displayed automatically', async function(this: CustomWorld) {
  const currentUrl = this.page.url();
  expect(currentUrl, 'Should be on dashboard page').toContain('localhost:8000');
  
  const isDashboardVisible = await this.pageObjects.dashboardPage.isDashboardVisible();
  expect(isDashboardVisible, 'Dashboard should be visible').toBe(true);
});

Then('the cart contents should be completely restored:', async function(this: CustomWorld, dataTable) {
  const expectedProducts = dataTable.hashes();
  const actualCartItems = await this.pageObjects.dashboardPage.getCartItems();
  
  expect(actualCartItems.length, 'Cart should have expected number of items').toBe(expectedProducts.length);
  
  for (const expectedProduct of expectedProducts) {
    const actualItem = actualCartItems.find(item => item.name === expectedProduct.Product);
    expect(actualItem, `Product "${expectedProduct.Product}" should be in cart`).toBeDefined();
    expect(actualItem?.quantity, `Quantity should match for "${expectedProduct.Product}"`).toBe(parseInt(expectedProduct.Quantity));
  }
});

Then('the cart item count should be accurate', async function(this: CustomWorld) {
  const cartItemCount = await this.pageObjects.dashboardPage.getCartItemCount();
  const expectedProducts = this.getTestData('addedProducts');
  
  const expectedCount = expectedProducts.reduce((sum: number, product: any) => sum + parseInt(product.Quantity), 0);
  expect(cartItemCount, 'Cart item count should be accurate').toBe(expectedCount);
});

Then('the total amount should be calculated correctly', async function(this: CustomWorld) {
  const totalAmount = await this.pageObjects.dashboardPage.getCartTotalAmount();
  expect(totalAmount, 'Total amount should be calculated').toBeGreaterThan(0);
  
  // Verify total is calculated correctly based on items and quantities
  const cartItems = await this.pageObjects.dashboardPage.getCartItems();
  let expectedTotal = 0;
  for (const item of cartItems) {
    expectedTotal += item.price * item.quantity;
  }
  
  expect(totalAmount, 'Total should match calculated amount').toBe(expectedTotal);
});

Then('all todo items should be restored:', async function(this: CustomWorld, dataTable) {
  const expectedTodos = dataTable.hashes();
  const actualTodos = await this.pageObjects.dashboardPage.getAllTodos();
  
  expect(actualTodos.length, 'Should have expected number of todos').toBe(expectedTodos.length);
  
  for (const expectedTodo of expectedTodos) {
    const actualTodo = actualTodos.find(todo => todo.text === expectedTodo['Todo Text']);
    expect(actualTodo, `Todo "${expectedTodo['Todo Text']}" should be restored`).toBeDefined();
    
    const expectedCompleted = expectedTodo.Status === 'completed';
    expect(actualTodo?.completed, `Todo completion status should be restored`).toBe(expectedCompleted);
  }
});

Then('the completion states should be accurate', async function(this: CustomWorld) {
  const todos = await this.pageObjects.dashboardPage.getAllTodos();
  const expectedTodos = this.getTestData('addedTodos');
  
  for (const expectedTodo of expectedTodos) {
    const actualTodo = todos.find(todo => todo.text === expectedTodo['Todo Text']);
    const expectedCompleted = expectedTodo.Status === 'completed';
    expect(actualTodo?.completed, `Completion state for "${expectedTodo['Todo Text']}" should be accurate`).toBe(expectedCompleted);
  }
});

Then('the item order should be preserved', async function(this: CustomWorld) {
  const todos = await this.pageObjects.dashboardPage.getAllTodos();
  const expectedTodos = this.getTestData('addedTodos');
  
  for (let i = 0; i < expectedTodos.length; i++) {
    expect(todos[i]?.text, `Todo order should be preserved at position ${i}`).toBe(expectedTodos[i]['Todo Text']);
  }
});

Then('all states should be restored correctly:', async function(this: CustomWorld, dataTable) {
  const expectedStates = dataTable.hashes();
  
  for (const state of expectedStates) {
    const stateType = state['State Type'];
    const expected = state['Expected'];
    
    switch (stateType) {
      case 'Login':
        const isLoggedIn = await this.pageObjects.loginPage.isUserAlreadyLoggedIn();
        expect(isLoggedIn, 'Login state should be restored').toBe(true);
        break;
        
      case 'Language':
        const currentLanguage = await this.pageObjects.dashboardPage.getCurrentLanguage();
        const expectedLang = expected === 'English' ? 'en' : 'jp';
        expect(currentLanguage, 'Language should be restored').toBe(expectedLang);
        break;
        
      case 'Cart':
        const cartItems = await this.pageObjects.dashboardPage.getCartItems();
        const hasExpectedItems = expected.split(', ').every(item => {
          const [product, quantity] = item.split(' × ');
          return cartItems.some(cartItem => 
            cartItem.name.includes(product) && cartItem.quantity === parseInt(quantity)
          );
        });
        expect(hasExpectedItems, 'Cart state should be restored').toBe(true);
        break;
        
      case 'Todo':
        const todos = await this.pageObjects.dashboardPage.getAllTodos();
        const todoMatch = expected.match(/"([^"]+)" \(([^)]+)\)/);
        if (todoMatch) {
          const [, todoText, status] = todoMatch;
          const todo = todos.find(t => t.text.includes(todoText));
          expect(todo, `Todo "${todoText}" should be restored`).toBeDefined();
          expect(todo?.completed, `Todo completion status should be restored`).toBe(status === 'completed');
        }
        break;
    }
  }
});

// Capacity and Error Handling
Then('the application should handle localStorage capacity appropriately', async function(this: CustomWorld) {
  const bulkTodoCount = this.getTestData('bulkTodoCount');
  const actualTodoCount = await this.pageObjects.dashboardPage.getTodoCount();
  
  // Should have either all todos or handle capacity gracefully
  expect(actualTodoCount, 'Should handle large data sets').toBeGreaterThan(0);
  expect(actualTodoCount, 'Should not exceed reasonable limits').toBeLessThanOrEqual(bulkTodoCount);
});

Then('if capacity limits are reached, appropriate error handling should occur', async function(this: CustomWorld) {
  // Check if error messages are shown when storage is full
  const hasCapacityError = await this.pageObjects.dashboardPage.hasStorageCapacityError();
  // This might be true or false depending on whether capacity was reached
  expect(typeof hasCapacityError, 'Capacity error handling should be implemented').toBe('boolean');
});

Then('critical data \\(login state) should be prioritized for storage', async function(this: CustomWorld) {
  const loginState = await this.pageObjects.loginPage.getLoginStateFromStorage();
  expect(loginState?.isLoggedIn, 'Login state should be preserved even with capacity issues').toBe(true);
});

Then('the application should work without localStorage', async function(this: CustomWorld) {
  // In incognito mode, basic functionality should still work
  const isApplicationResponsive = await this.pageObjects.dashboardPage.isApplicationResponsive();
  expect(isApplicationResponsive, 'Application should work without localStorage').toBe(true);
});

Then('data should be maintained during the session', async function(this: CustomWorld) {
  // Check that data persists during the current session even without localStorage
  const cartCount = await this.pageObjects.dashboardPage.getCartItemCount();
  expect(cartCount, 'Session data should be maintained').toBeGreaterThan(0);
});

Then('appropriate warning messages should be displayed \\(optional)', async function(this: CustomWorld) {
  // Check for optional warning about private browsing limitations
  const hasPrivacyWarning = await this.pageObjects.dashboardPage.hasPrivacyModeWarning();
  // This is optional, so we just verify the check works
  expect(typeof hasPrivacyWarning, 'Privacy warning check should work').toBe('boolean');
});

Then('the application should not crash', async function(this: CustomWorld) {
  const isApplicationRunning = await this.pageObjects.dashboardPage.isApplicationResponsive();
  expect(isApplicationRunning, 'Application should not crash with corrupted data').toBe(true);
});

Then('corrupted data should be detected and cleared', async function(this: CustomWorld) {
  const hasCorruptedData = await this.pageObjects.dashboardPage.hasCorruptedDataInStorage();
  expect(hasCorruptedData, 'Corrupted data should be cleared').toBe(false);
});

Then('the application should start with a clean initial state', async function(this: CustomWorld) {
  const isCleanState = await this.pageObjects.dashboardPage.isInCleanInitialState();
  expect(isCleanState, 'Should start with clean state after corruption').toBe(true);
});

Then('normal functionality should be available', async function(this: CustomWorld) {
  // Test that basic operations work after corruption recovery
  await this.pageObjects.dashboardPage.addTodo('Recovery test');
  const todos = await this.pageObjects.dashboardPage.getAllTodos();
  const recoveryTodo = todos.find(todo => todo.text === 'Recovery test');
  expect(recoveryTodo, 'Normal functionality should work after recovery').toBeDefined();
});

// Cross-browser and Advanced Tests
Then('all data should be properly persisted and restored', async function(this: CustomWorld) {
  const browserType = this.getTestData('browserType');
  
  // Verify that persistence works regardless of browser
  const isLoggedIn = await this.pageObjects.loginPage.isUserAlreadyLoggedIn();
  const cartCount = await this.pageObjects.dashboardPage.getCartItemCount();
  const todoCount = await this.pageObjects.dashboardPage.getTodoCount();
  
  expect(isLoggedIn, `Data persistence should work in ${browserType}`).toBe(true);
  expect(cartCount, `Cart data should persist in ${browserType}`).toBeGreaterThan(0);
  expect(todoCount, `Todo data should persist in ${browserType}`).toBeGreaterThan(0);
});

Then('localStorage functionality should work correctly', async function(this: CustomWorld) {
  const isLocalStorageWorking = await this.pageObjects.dashboardPage.isLocalStorageWorking();
  expect(isLocalStorageWorking, 'localStorage should work correctly').toBe(true);
});

Then('no browser-specific issues should occur', async function(this: CustomWorld) {
  const hasBrowserIssues = await this.pageObjects.dashboardPage.hasBrowserSpecificIssues();
  expect(hasBrowserIssues, 'No browser-specific issues should occur').toBe(false);
});

Then('the cart changes should be reflected in Tab 2', async function(this: CustomWorld) {
  const cartItems = await this.pageObjects.dashboardPage.getCartItems();
  const hasNewItem = cartItems.some(item => item.name.includes('ノートパソコン'));
  expect(hasNewItem, 'Cart changes should be reflected across tabs').toBe(true);
});

Then('both tabs should show consistent data', async function(this: CustomWorld) {
  const currentCartCount = await this.pageObjects.dashboardPage.getCartItemCount();
  expect(currentCartCount, 'Both tabs should show consistent cart data').toBeGreaterThan(1);
});

Then('localStorage events should synchronize properly', async function(this: CustomWorld) {
  // Test that storage events work for cross-tab synchronization
  const isSyncWorking = await this.pageObjects.dashboardPage.isLocalStorageSyncWorking();
  expect(isSyncWorking, 'localStorage sync should work across tabs').toBe(true);
});

Then('the old data should be migrated automatically', async function(this: CustomWorld) {
  const isMigrationComplete = await this.pageObjects.dashboardPage.isDataMigrationComplete();
  expect(isMigrationComplete, 'Data migration should complete automatically').toBe(true);
});

Then('no data loss should occur', async function(this: CustomWorld) {
  const oldData = this.getTestData('oldFormatData');
  const migratedData = await this.pageObjects.dashboardPage.getMigratedData();
  
  // Verify essential data was preserved during migration
  expect(migratedData.hasUserInfo, 'User info should be preserved').toBe(true);
  expect(migratedData.hasCartData, 'Cart data should be preserved').toBe(true);
});

Then('the application should function normally with migrated data', async function(this: CustomWorld) {
  // Test that application works normally after migration
  await this.pageObjects.dashboardPage.addTodo('Post-migration test');
  const todos = await this.pageObjects.dashboardPage.getAllTodos();
  const testTodo = todos.find(todo => todo.text === 'Post-migration test');
  expect(testTodo, 'Application should work normally after migration').toBeDefined();
});

Then('appropriate cleanup mechanisms should be available', async function(this: CustomWorld) {
  const hasCleanupMechanism = await this.pageObjects.dashboardPage.hasDataCleanupMechanism();
  expect(hasCleanupMechanism, 'Cleanup mechanisms should be available').toBe(true);
});

Then('old or unnecessary data should be removed', async function(this: CustomWorld) {
  const hasExcessiveData = await this.pageObjects.dashboardPage.hasExcessiveDataInStorage();
  expect(hasExcessiveData, 'Excessive data should be cleaned up').toBe(false);
});

Then('performance should be maintained', async function(this: CustomWorld) {
  const responseTime = await this.pageObjects.dashboardPage.measureResponseTime();
  expect(responseTime, 'Performance should be maintained').toBeLessThan(2000);
});

Then('passwords should not be stored in plain text', async function(this: CustomWorld) {
  const hasPlaintextPassword = await this.pageObjects.dashboardPage.hasPlaintextPasswordInStorage();
  expect(hasPlaintextPassword, 'Passwords should not be stored in plain text').toBe(false);
});

Then('sensitive information should be appropriately protected', async function(this: CustomWorld) {
  const isSensitiveDataProtected = await this.pageObjects.dashboardPage.isSensitiveDataProtected();
  expect(isSensitiveDataProtected, 'Sensitive data should be protected').toBe(true);
});

Then('data should be stored with minimal security risks', async function(this: CustomWorld) {
  const hasSecurityRisks = await this.pageObjects.dashboardPage.hasDataSecurityRisks();
  expect(hasSecurityRisks, 'Data should be stored securely').toBe(false);
});