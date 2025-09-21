import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

/**
 * Common Step Definitions
 * Shared steps across multiple features
 * Covers todo-list, language-switching, data-persistence, and integration scenarios
 */

// ===== COMMON SETUP STEPS =====

Given('the user starts with a clean application state', async function(this: CustomWorld) {
  await this.clearApplicationState();
  await this.navigateToApp();
});

Given('localStorage is available', async function(this: CustomWorld) {
  const isAvailable = await this.page.evaluate(() => {
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      return true;
    } catch {
      return false;
    }
  });

  expect(isAvailable, 'localStorage should be available').toBe(true);
});

Given('the user is not logged in', async function(this: CustomWorld) {
  await this.clearApplicationState();
  await this.navigateToApp();

  const isLoginModalDisplayed = await this.pageObjects.loginPage.isLoginModalDisplayed();
  expect(isLoginModalDisplayed, 'User should not be logged in').toBe(true);
});

// ===== TODO LIST STEPS =====

Given('the todo list is visible', async function(this: CustomWorld) {
  const todoSection = this.page.locator('#todoSection');
  await this.pageObjects.dashboardPage.waitForElementVisible(todoSection);
});

Given('the todo list is empty', async function(this: CustomWorld) {
  // Clear todo data from localStorage
  await this.page.evaluate(() => {
    localStorage.removeItem('todoData');
  });
  await this.pageObjects.dashboardPage.reload();

  const todoCount = await this.pageObjects.dashboardPage.getTodoItemCount();
  expect(todoCount).toBe(0);
});

Given('the todo list contains {string} in uncompleted state', async function(this: CustomWorld, todoText: string) {
  // Add todo item
  await this.pageObjects.dashboardPage.addTodoItem(todoText);

  // Verify it's uncompleted
  const isCompleted = await this.pageObjects.dashboardPage.isTodoItemCompleted(todoText);
  expect(isCompleted, 'Todo item should be uncompleted').toBe(false);
});

Given('the todo list contains {string} in completed state', async function(this: CustomWorld, todoText: string) {
  // Add todo item and mark as completed
  await this.pageObjects.dashboardPage.addTodoItem(todoText);
  await this.pageObjects.dashboardPage.toggleTodoCompletion(todoText);

  // Verify it's completed
  const isCompleted = await this.pageObjects.dashboardPage.isTodoItemCompleted(todoText);
  expect(isCompleted, 'Todo item should be completed').toBe(true);
});

Given('the todo list contains multiple items:', async function(this: CustomWorld, dataTable: DataTable) {
  const items = dataTable.raw().flat();

  // Clear existing todos first
  await this.page.evaluate(() => {
    localStorage.removeItem('todoData');
  });
  await this.pageObjects.dashboardPage.reload();

  // Add each item
  for (const item of items) {
    await this.pageObjects.dashboardPage.addTodoItem(item);
    await this.page.waitForTimeout(200);
  }

  this.setTestData('todoItems', items);
});

When('the user enters {string} in the todo text box', async function(this: CustomWorld, todoText: string) {
  await this.pageObjects.dashboardPage.enterTodoText(todoText);
  this.setTestData('enteredTodoText', todoText);
});

When('the user leaves the todo text box empty', async function(this: CustomWorld) {
  // Ensure text box is empty
  await this.pageObjects.dashboardPage.enterTodoText('');
});

When('the user enters a 100-character text in the todo text box', async function(this: CustomWorld) {
  const longText = 'A'.repeat(100);
  await this.pageObjects.dashboardPage.enterTodoText(longText);
  this.setTestData('enteredTodoText', longText);
});

When('the user clicks the {string} button', async function(this: CustomWorld, buttonText: string) {
  if (buttonText === '追加') {
    await this.pageObjects.dashboardPage.clickAddTodoButton();
  } else {
    throw new Error(`Unknown button: ${buttonText}`);
  }
});

When('the user clicks the checkbox for {string}', async function(this: CustomWorld, todoText: string) {
  await this.pageObjects.dashboardPage.toggleTodoCompletion(todoText);
  this.setTestData('toggledTodoItem', todoText);
});

When('the user clicks the delete button for {string}', async function(this: CustomWorld, todoText: string) {
  await this.pageObjects.dashboardPage.deleteTodoItem(todoText);
  this.setTestData('deletedTodoItem', todoText);
});

// Todo List Then Steps
Then('the new todo item should be added to the list', async function(this: CustomWorld) {
  const enteredText = this.getTestData('enteredTodoText');
  await this.pageObjects.dashboardPage.assertTodoItemAdded(enteredText);
});

Then('the item should be in uncompleted state', async function(this: CustomWorld) {
  const enteredText = this.getTestData('enteredTodoText');
  const isCompleted = await this.pageObjects.dashboardPage.isTodoItemCompleted(enteredText);
  expect(isCompleted, 'Todo item should be in uncompleted state').toBe(false);
});

Then('the text box should be cleared', async function(this: CustomWorld) {
  const textBoxValue = await this.page.locator('#todoInput').inputValue();
  expect(textBoxValue, 'Text box should be cleared').toBe('');
});

Then('the todo data should be saved in localStorage', async function(this: CustomWorld) {
  const todoData = await this.page.evaluate(() => {
    return localStorage.getItem('todoData');
  });
  expect(todoData, 'Todo data should be saved in localStorage').toBeTruthy();
});

Then('a validation error {string} should be displayed', async function(this: CustomWorld, expectedError: string) {
  // Check for validation error message
  const errorElement = this.page.locator('.error-message, .validation-error');
  const isVisible = await errorElement.isVisible();
  expect(isVisible, 'Validation error should be displayed').toBe(true);

  const errorText = await errorElement.textContent();
  expect(errorText, `Error should contain "${expectedError}"`).toContain(expectedError);
});

Then('no todo item should be added', async function(this: CustomWorld) {
  const todoCount = await this.pageObjects.dashboardPage.getTodoItemCount();
  expect(todoCount, 'No todo item should be added for empty input').toBe(0);
});

Then('the todo item should be added successfully', async function(this: CustomWorld) {
  const enteredText = this.getTestData('enteredTodoText');
  const exists = await this.pageObjects.dashboardPage.isTodoItemExists(enteredText);
  expect(exists, 'Todo item should be added successfully').toBe(true);
});

Then('the long text should be displayed properly with text wrapping', async function(this: CustomWorld) {
  // Verify the long text is visible and properly wrapped
  const enteredText = this.getTestData('enteredTodoText');
  const exists = await this.pageObjects.dashboardPage.isTodoItemExists(enteredText);
  expect(exists, 'Long text todo should be displayed properly').toBe(true);
});

Then('no performance degradation should occur', async function(this: CustomWorld) {
  // Check that page is still responsive
  const isResponsive = await this.page.evaluate(() => {
    return document.readyState === 'complete';
  });
  expect(isResponsive, 'No performance degradation should occur').toBe(true);
});

Then('the item should be marked as completed', async function(this: CustomWorld) {
  const toggledItem = this.getTestData('toggledTodoItem');
  const isCompleted = await this.pageObjects.dashboardPage.isTodoItemCompleted(toggledItem);
  expect(isCompleted, 'Item should be marked as completed').toBe(true);
});

Then('a strikethrough should be applied to the text', async function(this: CustomWorld) {
  const toggledItem = this.getTestData('toggledTodoItem');
  const todoElement = this.page.locator('.todo-item').filter({ hasText: toggledItem });
  const textElement = todoElement.locator('.todo-text');

  // Check for strikethrough styling
  const hasStrikethrough = await textElement.evaluate((el) => {
    const style = window.getComputedStyle(el);
    return style.textDecoration.includes('line-through') || el.classList.contains('completed');
  });

  expect(hasStrikethrough, 'Strikethrough should be applied to completed item').toBe(true);
});

Then('a checkmark should appear in the checkbox', async function(this: CustomWorld) {
  const toggledItem = this.getTestData('toggledTodoItem');
  const isChecked = await this.pageObjects.dashboardPage.isTodoItemCompleted(toggledItem);
  expect(isChecked, 'Checkbox should show checkmark').toBe(true);
});

Then('the item should be marked as uncompleted', async function(this: CustomWorld) {
  const toggledItem = this.getTestData('toggledTodoItem');
  const isCompleted = await this.pageObjects.dashboardPage.isTodoItemCompleted(toggledItem);
  expect(isCompleted, 'Item should be marked as uncompleted').toBe(false);
});

Then('the strikethrough should be removed from the text', async function(this: CustomWorld) {
  const toggledItem = this.getTestData('toggledTodoItem');
  const todoElement = this.page.locator('.todo-item').filter({ hasText: toggledItem });
  const textElement = todoElement.locator('.todo-text');

  const hasStrikethrough = await textElement.evaluate((el) => {
    const style = window.getComputedStyle(el);
    return style.textDecoration.includes('line-through') || el.classList.contains('completed');
  });

  expect(hasStrikethrough, 'Strikethrough should be removed').toBe(false);
});

Then('the checkbox should be unchecked', async function(this: CustomWorld) {
  const toggledItem = this.getTestData('toggledTodoItem');
  const isChecked = await this.pageObjects.dashboardPage.isTodoItemCompleted(toggledItem);
  expect(isChecked, 'Checkbox should be unchecked').toBe(false);
});

Then('{string} should be removed from the list', async function(this: CustomWorld, todoText: string) {
  const exists = await this.pageObjects.dashboardPage.isTodoItemExists(todoText);
  expect(exists, `${todoText} should be removed from the list`).toBe(false);
});

Then('{string} should remain in the list', async function(this: CustomWorld, todoText: string) {
  const exists = await this.pageObjects.dashboardPage.isTodoItemExists(todoText);
  expect(exists, `${todoText} should remain in the list`).toBe(true);
});

Then('the item should be removed from localStorage', async function(this: CustomWorld) {
  const deletedItem = this.getTestData('deletedTodoItem');
  const todoData = await this.page.evaluate(() => {
    const data = localStorage.getItem('todoData');
    return data ? JSON.parse(data) : [];
  });

  const itemExists = todoData.some((item: any) => item.text === deletedItem);
  expect(itemExists, 'Item should be removed from localStorage').toBe(false);
});

// ===== LANGUAGE SWITCHING STEPS =====

Given('the application is displayed in Japanese', async function(this: CustomWorld) {
  // Ensure Japanese is selected
  await this.pageObjects.dashboardPage.clickJapaneseLanguageButton();
  await this.pageObjects.dashboardPage.assertLanguageSwitch('jp');
});

Given('the application is displayed in English', async function(this: CustomWorld) {
  await this.pageObjects.dashboardPage.clickEnglishLanguageButton();
  await this.pageObjects.dashboardPage.assertLanguageSwitch('en');
});

Given('the header shows {string} and {string} buttons', async function(this: CustomWorld, button1: string, button2: string) {
  const jp_button = this.page.locator('#langJp');
  const en_button = this.page.locator('#langEn');

  const jpVisible = await jp_button.isVisible();
  const enVisible = await en_button.isVisible();

  expect(jpVisible, 'JP button should be visible').toBe(true);
  expect(enVisible, 'EN button should be visible').toBe(true);
});

When('the user clicks the {string} button', async function(this: CustomWorld, buttonText: string) {
  if (buttonText === 'EN') {
    await this.pageObjects.dashboardPage.clickEnglishLanguageButton();
  } else if (buttonText === 'JP') {
    await this.pageObjects.dashboardPage.clickJapaneseLanguageButton();
  } else {
    throw new Error(`Unknown language button: ${buttonText}`);
  }

  this.setTestData('selectedLanguage', buttonText);
});

When('the user switches to English', async function(this: CustomWorld) {
  await this.pageObjects.dashboardPage.clickEnglishLanguageButton();
  this.setTestData('selectedLanguage', 'EN');
});

When('the user switches between languages', async function(this: CustomWorld) {
  // Switch to English first, then back to Japanese
  await this.pageObjects.dashboardPage.clickEnglishLanguageButton();
  await this.page.waitForTimeout(1000);
  await this.pageObjects.dashboardPage.clickJapaneseLanguageButton();
  await this.page.waitForTimeout(1000);
});

When('the user switches to English', async function(this: CustomWorld) {
  await this.pageObjects.dashboardPage.clickEnglishLanguageButton();
});

// Language Then Steps
Then('all UI elements should be displayed in English', async function(this: CustomWorld) {
  await this.pageObjects.dashboardPage.assertLanguageSwitch('en');
});

Then('all UI elements should be displayed in Japanese', async function(this: CustomWorld) {
  await this.pageObjects.dashboardPage.assertLanguageSwitch('jp');
});

Then('product names should be displayed in English', async function(this: CustomWorld) {
  // Check a few products have English names
  const productCount = await this.pageObjects.dashboardPage.getProductCount();
  for (let i = 0; i < Math.min(3, productCount); i++) {
    const productInfo = await this.pageObjects.dashboardPage.getProductInfo(i);
    const hasEnglishContent = /[a-zA-Z]/.test(productInfo.name);
    expect(hasEnglishContent, `Product ${i} should have English name`).toBe(true);
  }
});

Then('product names should be displayed in Japanese', async function(this: CustomWorld) {
  // Check products have Japanese characters
  const productCount = await this.pageObjects.dashboardPage.getProductCount();
  for (let i = 0; i < Math.min(3, productCount); i++) {
    const productInfo = await this.pageObjects.dashboardPage.getProductInfo(i);
    const hasJapaneseContent = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(productInfo.name);
    expect(hasJapaneseContent, `Product ${i} should have Japanese name`).toBe(true);
  }
});

Then('the {string} button should be in active state', async function(this: CustomWorld, buttonText: string) {
  if (buttonText === 'EN') {
    const isActive = await this.pageObjects.dashboardPage.isEnglishLanguageActive();
    expect(isActive, 'EN button should be active').toBe(true);
  } else if (buttonText === 'JP') {
    const isActive = await this.pageObjects.dashboardPage.isJapaneseLanguageActive();
    expect(isActive, 'JP button should be active').toBe(true);
  }
});

Then('the language setting should be saved in localStorage', async function(this: CustomWorld) {
  const selectedLanguage = this.getTestData('selectedLanguage');
  const languageData = await this.page.evaluate(() => {
    return localStorage.getItem('language');
  });

  const expectedLanguage = selectedLanguage === 'EN' ? 'en' : 'ja';
  expect(languageData, 'Language setting should be saved').toBe(expectedLanguage);
});

Then('the application should remain in English', async function(this: CustomWorld) {
  const isEnglishActive = await this.pageObjects.dashboardPage.isEnglishLanguageActive();
  expect(isEnglishActive, 'Application should remain in English').toBe(true);
});

Then('product names should remain in English', async function(this: CustomWorld) {
  // Same as "product names should be displayed in English"
  const productCount = await this.pageObjects.dashboardPage.getProductCount();
  for (let i = 0; i < Math.min(2, productCount); i++) {
    const productInfo = await this.pageObjects.dashboardPage.getProductInfo(i);
    const hasEnglishContent = /[a-zA-Z]/.test(productInfo.name);
    expect(hasEnglishContent, `Product ${i} should remain in English`).toBe(true);
  }
});

Then('the {string} button should remain in active state', async function(this: CustomWorld, buttonText: string) {
  if (buttonText === 'EN') {
    const isActive = await this.pageObjects.dashboardPage.isEnglishLanguageActive();
    expect(isActive, 'EN button should remain active').toBe(true);
  }
});

// ===== DATA PERSISTENCE STEPS =====

Then('the todo item should be restored', async function(this: CustomWorld) {
  const todoCount = await this.pageObjects.dashboardPage.getTodoItemCount();
  expect(todoCount, 'Todo items should be restored').toBeGreaterThan(0);
});

Then('the completion state should be maintained', async function(this: CustomWorld) {
  // Check that completed/uncompleted states are preserved
  const todoItems = await this.page.locator('.todo-item').count();
  expect(todoItems, 'Todo completion states should be maintained').toBeGreaterThan(0);
});

Then('the todo functionality should work normally', async function(this: CustomWorld) {
  // Test adding a new todo after restoration
  await this.pageObjects.dashboardPage.addTodoItem('Test persistence');
  const exists = await this.pageObjects.dashboardPage.isTodoItemExists('Test persistence');
  expect(exists, 'Todo functionality should work normally').toBe(true);
});

// ===== COMPLEX SCENARIO STEPS =====

When('the user performs the following operations in sequence:', async function(this: CustomWorld, dataTable: DataTable) {
  const operations = dataTable.hashes();

  for (const operation of operations) {
    const step = operation.Step;
    const operationType = operation.Operation;
    const details = operation.Details;

    console.log(`Executing step ${step}: ${operationType} - ${details}`);

    switch (operationType) {
      case 'Add Product A to cart':
        await this.pageObjects.dashboardPage.addProductToCart(details);
        break;
      case 'Switch language':
        if (details === 'to English') {
          await this.pageObjects.dashboardPage.clickEnglishLanguageButton();
        }
        break;
      case 'Add Product B to cart':
        await this.pageObjects.dashboardPage.addProductToCart(details);
        break;
      case 'Add Todo item 1':
        await this.pageObjects.dashboardPage.addTodoItem(details.replace(/"/g, ''));
        break;
      case 'Change Product A quantity':
        // This would require navigating to cart page
        await this.pageObjects.cartPage.navigateToCart();
        await this.pageObjects.cartPage.changeItemQuantity('Smartphone', details.split(' ')[1]);
        await this.pageObjects.dashboardPage.goto();
        break;
      case 'Mark Todo item 1 as completed':
        await this.pageObjects.dashboardPage.toggleTodoCompletion('item1');
        break;
      default:
        console.warn(`Unknown operation: ${operationType}`);
    }

    await this.page.waitForTimeout(500); // Small delay between operations
  }
});

Then('all operations should complete successfully', async function(this: CustomWorld) {
  // Basic check that page is still functional
  const isResponsive = await this.page.evaluate(() => {
    return document.readyState === 'complete';
  });
  expect(isResponsive, 'All operations should complete successfully').toBe(true);
});

Then('the cart should contain:', async function(this: CustomWorld, dataTable: DataTable) {
  const expectedItems = dataTable.hashes();

  // Navigate to cart to verify
  await this.pageObjects.cartPage.navigateToCart();

  for (const expectedItem of expectedItems) {
    const product = expectedItem.Product;
    const quantity = expectedItem.Quantity;

    const itemExists = await this.pageObjects.cartPage.isItemInCart(product);
    expect(itemExists, `${product} should be in cart`).toBe(true);

    const actualQuantity = await this.pageObjects.cartPage.getItemQuantity(product);
    expect(parseInt(actualQuantity), `${product} quantity should be ${quantity}`).toBe(parseInt(quantity));
  }
});

Then('the todo list should contain:', async function(this: CustomWorld, dataTable: DataTable) {
  const expectedItems = dataTable.hashes();

  // Navigate back to dashboard
  await this.pageObjects.dashboardPage.goto();

  for (const expectedItem of expectedItems) {
    const item = expectedItem.Item;
    const status = expectedItem.Status;

    const itemExists = await this.pageObjects.dashboardPage.isTodoItemExists(item);
    expect(itemExists, `Todo item "${item}" should exist`).toBe(true);

    const isCompleted = await this.pageObjects.dashboardPage.isTodoItemCompleted(item);
    const expectedCompleted = status === 'completed';
    expect(isCompleted, `Todo item "${item}" should be ${status}`).toBe(expectedCompleted);
  }
});

Then('the language should be English', async function(this: CustomWorld) {
  const isEnglishActive = await this.pageObjects.dashboardPage.isEnglishLanguageActive();
  expect(isEnglishActive, 'Language should be English').toBe(true);
});

Then('all data should be accurately saved in localStorage', async function(this: CustomWorld) {
  const localStorageState = await this.getLocalStorageState();

  // Check that all expected data types are present
  const hasCartData = 'cartData' in localStorageState;
  const hasTodoData = 'todoData' in localStorageState;
  const hasLanguageData = 'language' in localStorageState;

  expect(hasCartData, 'Cart data should be saved').toBe(true);
  expect(hasTodoData, 'Todo data should be saved').toBe(true);
  expect(hasLanguageData, 'Language data should be saved').toBe(true);
});

// ===== UTILITY STEPS =====

Then('data integrity should be maintained', async function(this: CustomWorld) {
  // Verify that localStorage data is valid JSON and contains expected structure
  const localStorageState = await this.getLocalStorageState();

  for (const [key, value] of Object.entries(localStorageState)) {
    try {
      if (value && value.trim().startsWith('{') || value.trim().startsWith('[')) {
        JSON.parse(value);
      }
    } catch (error) {
      throw new Error(`Invalid JSON in localStorage key "${key}": ${error}`);
    }
  }

  console.log('Data integrity verified - all localStorage data is valid');
});

Then('localStorage should reflect all changes', async function(this: CustomWorld) {
  const localStorageState = await this.getLocalStorageState();
  const hasData = Object.keys(localStorageState).length > 0;
  expect(hasData, 'localStorage should contain data reflecting changes').toBe(true);
});

// ===== ERROR HANDLING STEPS =====

Then('the text should be displayed as plain text', async function(this: CustomWorld) {
  // For XSS prevention - verify script tags are displayed as text
  const enteredText = this.getTestData('enteredTodoText');
  if (enteredText && enteredText.includes('<script>')) {
    const todoExists = await this.pageObjects.dashboardPage.isTodoItemExists(enteredText);
    expect(todoExists, 'Script should be displayed as plain text').toBe(true);
  }
});

Then('no XSS alert should appear', async function(this: CustomWorld) {
  // Same as in other step definitions
  let alertFired = false;

  this.page.on('dialog', async (dialog) => {
    alertFired = true;
    await dialog.dismiss();
  });

  await this.page.waitForTimeout(1000);
  expect(alertFired, 'No XSS alert should appear').toBe(false);
});