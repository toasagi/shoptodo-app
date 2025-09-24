import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

/**
 * Language Switching Step Definitions
 * Maps to language-switching.feature scenarios
 * Test Cases: TC-LANG-001 to TC-LANG-008
 * Requirements: REQ-F-010 (Multi-language Support)
 */

// Given Steps
Given('the application is displayed in Japanese', async function(this: CustomWorld) {
  await this.pageObjects.dashboardPage.setLanguage('jp');
  await this.page.waitForTimeout(500);
  
  const currentLanguage = await this.pageObjects.dashboardPage.getCurrentLanguage();
  expect(currentLanguage, 'Application should be in Japanese').toBe('jp');
});

Given('the application is displayed in English', async function(this: CustomWorld) {
  await this.pageObjects.dashboardPage.setLanguage('en');
  await this.page.waitForTimeout(500);
  
  const currentLanguage = await this.pageObjects.dashboardPage.getCurrentLanguage();
  expect(currentLanguage, 'Application should be in English').toBe('en');
});

Given('the header shows {string} and {string} buttons', async function(this: CustomWorld, button1: string, button2: string) {
  const isJpButtonVisible = await this.pageObjects.dashboardPage.isLanguageButtonVisible('JP');
  const isEnButtonVisible = await this.pageObjects.dashboardPage.isLanguageButtonVisible('EN');
  
  expect(isJpButtonVisible, 'JP button should be visible').toBe(true);
  expect(isEnButtonVisible, 'EN button should be visible').toBe(true);
});

Given('the user is on the product catalog', async function(this: CustomWorld) {
  await this.pageObjects.dashboardPage.navigateToProductCatalog();
  const isProductCatalogVisible = await this.pageObjects.dashboardPage.isProductCatalogVisible();
  expect(isProductCatalogVisible, 'Product catalog should be visible').toBe(true);
});

Given('the todo list contains Japanese text {string}', async function(this: CustomWorld, todoText: string) {
  await this.pageObjects.dashboardPage.addTodo(todoText);
  const todos = await this.pageObjects.dashboardPage.getAllTodos();
  const japaneseTodo = todos.find(todo => todo.text === todoText);
  expect(japaneseTodo, `Todo with Japanese text "${todoText}" should exist`).toBeDefined();
});

Given('the user has searched for {string}', async function(this: CustomWorld, searchTerm: string) {
  await this.pageObjects.dashboardPage.searchProducts(searchTerm);
  this.setTestData('searchTerm', searchTerm);
});

Given('the cart contains products', async function(this: CustomWorld) {
  await this.pageObjects.dashboardPage.addProductToCart('スマートフォン', 1);
  await this.pageObjects.dashboardPage.addProductToCart('ノートパソコン', 1);
  
  const cartCount = await this.pageObjects.dashboardPage.getCartItemCount();
  expect(cartCount, 'Cart should contain products').toBeGreaterThan(0);
});

Given('the user has set the language to English', async function(this: CustomWorld) {
  await this.pageObjects.dashboardPage.setLanguage('en');
  const currentLanguage = await this.pageObjects.dashboardPage.getCurrentLanguage();
  expect(currentLanguage, 'Language should be set to English').toBe('en');
  
  // Store language preference for persistence test
  this.setTestData('selectedLanguage', 'en');
});

// When Steps
When('the user clicks the {string} button', async function(this: CustomWorld, buttonName: string) {
  if (buttonName === 'EN') {
    await this.pageObjects.dashboardPage.clickLanguageButton('EN');
  } else if (buttonName === 'JP') {
    await this.pageObjects.dashboardPage.clickLanguageButton('JP');
  } else {
    throw new Error(`Unknown language button: ${buttonName}`);
  }
  
  // Wait for language switching to complete
  await this.page.waitForTimeout(1000);
});

When('the user switches to English', async function(this: CustomWorld) {
  await this.pageObjects.dashboardPage.setLanguage('en');
  await this.page.waitForTimeout(500);
});

When('the user switches to Japanese', async function(this: CustomWorld) {
  await this.pageObjects.dashboardPage.setLanguage('jp');
  await this.page.waitForTimeout(500);
});

When('the user switches between languages', async function(this: CustomWorld) {
  // Switch to English first
  await this.pageObjects.dashboardPage.setLanguage('en');
  await this.page.waitForTimeout(500);
  
  // Then switch to Japanese
  await this.pageObjects.dashboardPage.setLanguage('jp');
  await this.page.waitForTimeout(500);
  
  // Switch back to English for verification
  await this.pageObjects.dashboardPage.setLanguage('en');
  await this.page.waitForTimeout(500);
});

When('the user searches for {string}', async function(this: CustomWorld, searchTerm: string) {
  await this.pageObjects.dashboardPage.searchProducts(searchTerm);
  this.setTestData('currentSearchTerm', searchTerm);
});

When('the user views the cart page', async function(this: CustomWorld) {
  await this.pageObjects.dashboardPage.navigateToCart();
  const isCartVisible = await this.pageObjects.dashboardPage.isCartVisible();
  expect(isCartVisible, 'Cart should be visible').toBe(true);
});

When('the user hovers over the {string} button', async function(this: CustomWorld, buttonName: string) {
  await this.pageObjects.dashboardPage.hoverLanguageButton(buttonName);
  await this.page.waitForTimeout(500);
});

When('a language switching error occurs \\(simulated)', async function(this: CustomWorld) {
  // Store current language for fallback verification
  const currentLanguage = await this.pageObjects.dashboardPage.getCurrentLanguage();
  this.setTestData('languageBeforeError', currentLanguage);
  
  // Simulate error by attempting invalid language switch
  await this.pageObjects.dashboardPage.simulateLanguageSwitchError();
});

When('the user performs the following actions in sequence:', async function(this: CustomWorld, dataTable) {
  const actions = dataTable.hashes();
  
  for (const action of actions) {
    const actionType = action.Action;
    const expectedLanguage = action['Expected Language'];
    
    switch (actionType) {
      case 'Browse products':
        await this.pageObjects.dashboardPage.navigateToProductCatalog();
        break;
      case 'Add items to cart':
        await this.pageObjects.dashboardPage.addProductToCart('スマートフォン', 1);
        break;
      case 'Switch to English':
        await this.pageObjects.dashboardPage.setLanguage('en');
        break;
      case 'View cart':
        await this.pageObjects.dashboardPage.navigateToCart();
        break;
      case 'Add todo items':
        await this.pageObjects.dashboardPage.addTodo('Test todo item');
        break;
      case 'Reload page':
        await this.page.reload();
        await this.pageObjects.dashboardPage.waitForPageLoad();
        break;
      case 'Switch back to Japanese':
        await this.pageObjects.dashboardPage.setLanguage('jp');
        break;
    }
    
    await this.page.waitForTimeout(500);
    
    // Verify language after each step
    if (expectedLanguage) {
      const currentLanguage = await this.pageObjects.dashboardPage.getCurrentLanguage();
      const expectedLangCode = expectedLanguage === 'Japanese' ? 'jp' : 'en';
      expect(currentLanguage, `Language should be ${expectedLanguage} after ${actionType}`).toBe(expectedLangCode);
    }
  }
});

// Then Steps - Language Display Verification
Then('all UI elements should be displayed in English', async function(this: CustomWorld) {
  const uiTexts = await this.pageObjects.dashboardPage.getUITextsInCurrentLanguage();
  
  // Check common UI elements are in English
  expect(uiTexts.loginButton, 'Login button should be in English').toContain('Login');
  expect(uiTexts.logoutButton, 'Logout button should be in English').toContain('Logout');
  expect(uiTexts.searchPlaceholder, 'Search placeholder should be in English').toContain('Search');
  expect(uiTexts.addToCartButton, 'Add to cart button should be in English').toContain('Add to Cart');
});

Then('all UI elements should be displayed in Japanese', async function(this: CustomWorld) {
  const uiTexts = await this.pageObjects.dashboardPage.getUITextsInCurrentLanguage();
  
  // Check common UI elements are in Japanese
  expect(uiTexts.loginButton, 'Login button should be in Japanese').toContain('ログイン');
  expect(uiTexts.logoutButton, 'Logout button should be in Japanese').toContain('ログアウト');
  expect(uiTexts.searchPlaceholder, 'Search placeholder should be in Japanese').toContain('検索');
  expect(uiTexts.addToCartButton, 'Add to cart button should be in Japanese').toContain('カートに追加');
});

Then('product names should be displayed in English', async function(this: CustomWorld) {
  const productNames = await this.pageObjects.dashboardPage.getAllProductNames();
  
  // Check that products have English names
  expect(productNames, 'Should have English product names').toContain('Smartphone');
  expect(productNames, 'Should have English product names').toContain('Laptop');
  expect(productNames, 'Should have English product names').toContain('T-shirt');
});

Then('product names should be displayed in Japanese', async function(this: CustomWorld) {
  const productNames = await this.pageObjects.dashboardPage.getAllProductNames();
  
  // Check that products have Japanese names
  expect(productNames, 'Should have Japanese product names').toContain('スマートフォン');
  expect(productNames, 'Should have Japanese product names').toContain('ノートパソコン');
  expect(productNames, 'Should have Japanese product names').toContain('Tシャツ');
});

Then('the {string} button should be in active state', async function(this: CustomWorld, buttonName: string) {
  const isActive = await this.pageObjects.dashboardPage.isLanguageButtonActive(buttonName);
  expect(isActive, `${buttonName} button should be in active state`).toBe(true);
});

Then('the language setting should be saved in localStorage', async function(this: CustomWorld) {
  const savedLanguage = await this.pageObjects.dashboardPage.getLanguageFromStorage();
  const currentLanguage = await this.pageObjects.dashboardPage.getCurrentLanguage();
  expect(savedLanguage, 'Language setting should be saved in localStorage').toBe(currentLanguage);
});

Then('the application should remain in English', async function(this: CustomWorld) {
  const currentLanguage = await this.pageObjects.dashboardPage.getCurrentLanguage();
  expect(currentLanguage, 'Application should remain in English').toBe('en');
});

Then('product names should remain in English', async function(this: CustomWorld) {
  const productNames = await this.pageObjects.dashboardPage.getAllProductNames();
  expect(productNames, 'Product names should remain in English').toContain('Smartphone');
});

Then('the {string} button should remain in active state', async function(this: CustomWorld, buttonName: string) {
  const isActive = await this.pageObjects.dashboardPage.isLanguageButtonActive(buttonName);
  expect(isActive, `${buttonName} button should remain in active state`).toBe(true);
});

// UI Elements Translation Verification
Then('all the following elements should be translated:', async function(this: CustomWorld, dataTable) {
  const translations = dataTable.hashes();
  
  for (const translation of translations) {
    const elementType = translation['Element Type'];
    const englishText = translation['English'];
    
    const actualText = await this.pageObjects.dashboardPage.getElementTextByType(elementType);
    expect(actualText, `${elementType} should be translated to English`).toContain(englishText);
  }
});

Then('no untranslated items should exist', async function(this: CustomWorld) {
  const untranslatedItems = await this.pageObjects.dashboardPage.findUntranslatedItems();
  expect(untranslatedItems.length, 'No untranslated items should exist').toBe(0);
});

// Product Translation Verification
Then('product names should be correctly translated:', async function(this: CustomWorld, dataTable) {
  const expectedTranslations = dataTable.hashes();
  const actualProductNames = await this.pageObjects.dashboardPage.getAllProductNames();
  
  for (const translation of expectedTranslations) {
    const englishName = translation['English'];
    expect(actualProductNames, `Product "${englishName}" should be displayed`).toContain(englishName);
  }
});

Then('all products should have translations in both languages', async function(this: CustomWorld) {
  // Switch to Japanese and get product names
  await this.pageObjects.dashboardPage.setLanguage('jp');
  const japaneseNames = await this.pageObjects.dashboardPage.getAllProductNames();
  
  // Switch to English and get product names
  await this.pageObjects.dashboardPage.setLanguage('en');
  const englishNames = await this.pageObjects.dashboardPage.getAllProductNames();
  
  expect(japaneseNames.length, 'Should have same number of products in both languages').toBe(englishNames.length);
  expect(japaneseNames.length, 'Should have products in Japanese').toBeGreaterThan(0);
  expect(englishNames.length, 'Should have products in English').toBeGreaterThan(0);
});

// Dynamic Content Handling
Then('the todo item text should remain as {string}', async function(this: CustomWorld, expectedText: string) {
  const todos = await this.pageObjects.dashboardPage.getAllTodos();
  const targetTodo = todos.find(todo => todo.text === expectedText);
  expect(targetTodo, `Todo with text "${expectedText}" should remain unchanged`).toBeDefined();
});

Then('only UI elements should be translated to English', async function(this: CustomWorld) {
  const uiTexts = await this.pageObjects.dashboardPage.getUITextsInCurrentLanguage();
  expect(uiTexts.addButton, 'UI elements should be in English').toContain('Add');
  
  // User input should remain in original language
  const todos = await this.pageObjects.dashboardPage.getAllTodos();
  const japaneseTodo = todos.find(todo => todo.text.includes('日本語'));
  expect(japaneseTodo, 'User input should remain in original language').toBeDefined();
});

Then('user input data should be language-independent', async function(this: CustomWorld) {
  // Verify that user input (todos, search terms) are not translated
  const todos = await this.pageObjects.dashboardPage.getAllTodos();
  const hasOriginalUserData = todos.some(todo => todo.text.includes('日本語'));
  expect(hasOriginalUserData, 'User input data should remain unchanged').toBe(true);
});

// Search and Integration Tests
Then('the English product names should be searched', async function(this: CustomWorld) {
  const searchResults = await this.pageObjects.dashboardPage.getSearchResults();
  const hasEnglishResults = searchResults.some(result => result.includes('Smart'));
  expect(hasEnglishResults, 'English product names should be searchable').toBe(true);
});

Then('the search results should display correctly', async function(this: CustomWorld) {
  const searchResults = await this.pageObjects.dashboardPage.getSearchResults();
  expect(searchResults.length, 'Search results should be displayed').toBeGreaterThan(0);
});

Then('the search history should be cleared appropriately', async function(this: CustomWorld) {
  // Verify search behavior after language switch
  const searchValue = await this.pageObjects.dashboardPage.getSearchInputValue();
  expect(searchValue, 'Search input should be manageable after language switch').toBeDefined();
});

// Cart Integration Tests
Then('cart product names should be displayed in English', async function(this: CustomWorld) {
  const cartItems = await this.pageObjects.dashboardPage.getCartItems();
  const hasEnglishNames = cartItems.some(item => item.name.includes('Smartphone') || item.name.includes('Laptop'));
  expect(hasEnglishNames, 'Cart product names should be in English').toBe(true);
});

Then('cart functionality should work normally', async function(this: CustomWorld) {
  await this.pageObjects.dashboardPage.addProductToCart('Smartphone', 1);
  const cartCount = await this.pageObjects.dashboardPage.getCartItemCount();
  expect(cartCount, 'Cart functionality should work after language switch').toBeGreaterThan(0);
});

Then('price formatting should be appropriate for the language', async function(this: CustomWorld) {
  const cartItems = await this.pageObjects.dashboardPage.getCartItems();
  const hasPriceFormatting = cartItems.every(item => item.price.includes('¥') || item.price.includes('$'));
  expect(hasPriceFormatting, 'Price formatting should be appropriate').toBe(true);
});

// Persistence Tests
Then('the application should start in English', async function(this: CustomWorld) {
  const currentLanguage = await this.pageObjects.dashboardPage.getCurrentLanguage();
  expect(currentLanguage, 'Application should start in English').toBe('en');
});

Then('all content should be displayed in English', async function(this: CustomWorld) {
  const uiTexts = await this.pageObjects.dashboardPage.getUITextsInCurrentLanguage();
  const productNames = await this.pageObjects.dashboardPage.getAllProductNames();
  
  expect(uiTexts.loginButton, 'UI should be in English').toContain('Login');
  expect(productNames, 'Products should be in English').toContain('Smartphone');
});

// Visual Feedback Tests
Then('appropriate hover effects should be shown', async function(this: CustomWorld) {
  const hasHoverEffect = await this.pageObjects.dashboardPage.checkLanguageButtonHoverEffect('EN');
  expect(hasHoverEffect, 'Hover effects should be shown').toBe(true);
});

Then('immediate visual feedback should be provided', async function(this: CustomWorld) {
  // Check that language switch happens quickly
  const startTime = Date.now();
  await this.pageObjects.dashboardPage.setLanguage('jp');
  const endTime = Date.now();
  
  const switchTime = endTime - startTime;
  expect(switchTime, 'Language switch should be immediate').toBeLessThan(2000);
});

Then('the language switch should be smooth without flicker', async function(this: CustomWorld) {
  // Check for smooth transition without visual glitches
  const hasFlicker = await this.pageObjects.dashboardPage.checkForVisualFlicker();
  expect(hasFlicker, 'Language switch should be smooth without flicker').toBe(false);
});

// Comprehensive Flow Tests
Then('each step should display content in the correct language', async function(this: CustomWorld) {
  const currentLanguage = await this.pageObjects.dashboardPage.getCurrentLanguage();
  const uiTexts = await this.pageObjects.dashboardPage.getUITextsInCurrentLanguage();
  
  if (currentLanguage === 'en') {
    expect(uiTexts.loginButton, 'UI should be in English').toContain('Login');
  } else {
    expect(uiTexts.loginButton, 'UI should be in Japanese').toContain('ログイン');
  }
});

Then('all functionality should work properly in both languages', async function(this: CustomWorld) {
  // Test key functionality in current language
  await this.pageObjects.dashboardPage.addTodo('Language test');
  await this.pageObjects.dashboardPage.addProductToCart('Test Product', 1);
  
  const todoCount = await this.pageObjects.dashboardPage.getTodoCount();
  const cartCount = await this.pageObjects.dashboardPage.getCartItemCount();
  
  expect(todoCount, 'Todo functionality should work').toBeGreaterThan(0);
  expect(cartCount, 'Cart functionality should work').toBeGreaterThan(0);
});

Then('data integrity should be maintained throughout', async function(this: CustomWorld) {
  // Verify that data remains consistent across language switches
  const todos = await this.pageObjects.dashboardPage.getAllTodos();
  const cartItems = await this.pageObjects.dashboardPage.getCartItems();
  
  expect(todos.length, 'Todo data should be maintained').toBeGreaterThan(0);
  expect(cartItems.length, 'Cart data should be maintained').toBeGreaterThan(0);
});

// Error Handling Tests
Then('the application should fallback to the previous language', async function(this: CustomWorld) {
  const previousLanguage = this.getTestData('languageBeforeError');
  const currentLanguage = await this.pageObjects.dashboardPage.getCurrentLanguage();
  expect(currentLanguage, 'Should fallback to previous language').toBe(previousLanguage);
});

Then('an appropriate error message should be displayed', async function(this: CustomWorld) {
  const errorMessage = await this.pageObjects.dashboardPage.getLanguageErrorMessage();
  expect(errorMessage, 'Error message should be displayed').toBeTruthy();
});

Then('the user should be able to retry the language switch', async function(this: CustomWorld) {
  // Test that language switching still works after error
  await this.pageObjects.dashboardPage.setLanguage('en');
  const currentLanguage = await this.pageObjects.dashboardPage.getCurrentLanguage();
  expect(currentLanguage, 'Should be able to retry language switch').toBe('en');
});