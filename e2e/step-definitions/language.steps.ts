import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

// Given Steps
Given('the language is set to Japanese', async function(this: CustomWorld) {
  // Click the Japanese language button (#lang-ja)
  const jaButton = this.page.locator('#lang-ja');
  await jaButton.click();
  await this.page.waitForTimeout(500);

  // Verify language is set to Japanese (localStorage uses 'ja' not 'jp')
  const lang = await this.dashboardPage.getCurrentLanguage();
  expect(['ja', 'jp'].includes(lang), 'Language should be set to Japanese').toBe(true);
});

// When Steps
When('the user switches language to Japanese', async function(this: CustomWorld) {
  // Click the Japanese language button (#lang-ja)
  await this.page.locator('#lang-ja').click();
  await this.page.waitForTimeout(500);
});

When('the user switches language to English', async function(this: CustomWorld) {
  // Click the English language button (#lang-en)
  await this.page.locator('#lang-en').click();
  await this.page.waitForTimeout(500);
});

// Then Steps
Then('the UI should display in Japanese', async function(this: CustomWorld) {
  // Check language in localStorage (can be 'ja' or 'jp')
  const lang = await this.dashboardPage.getCurrentLanguage();
  expect(['ja', 'jp'].includes(lang), 'Language should be Japanese').toBe(true);

  // Verify some UI text is in Japanese
  const uiTexts = await this.dashboardPage.getUITextsInCurrentLanguage();
  expect(
    uiTexts.logoutButton.includes('ログアウト') || uiTexts.addButton.includes('追加'),
    'UI should display Japanese text'
  ).toBe(true);
});

Then('the UI should display in English', async function(this: CustomWorld) {
  const lang = await this.dashboardPage.getCurrentLanguage();
  expect(lang, 'Language should be English').toBe('en');

  // Verify some UI text is in English
  const uiTexts = await this.dashboardPage.getUITextsInCurrentLanguage();
  expect(
    uiTexts.logoutButton.toLowerCase().includes('logout') || uiTexts.addButton.toLowerCase().includes('add'),
    'UI should display English text'
  ).toBe(true);
});

Then('the logout button text should be in Japanese', async function(this: CustomWorld) {
  const uiTexts = await this.dashboardPage.getUITextsInCurrentLanguage();
  expect(uiTexts.logoutButton, 'Logout button should be in Japanese').toContain('ログアウト');
});

Then('the logout button text should be {string}', async function(this: CustomWorld, expectedText: string) {
  const uiTexts = await this.dashboardPage.getUITextsInCurrentLanguage();
  expect(
    uiTexts.logoutButton.toLowerCase(),
    `Logout button should contain "${expectedText}"`
  ).toContain(expectedText.toLowerCase());
});

// ============================================
// Additional i18n Steps (Issue #27)
// ============================================

Then('the UI labels should be in Japanese', async function(this: CustomWorld) {
  // Verify search placeholder is in Japanese
  const searchPlaceholder = await this.page.locator('#search-input').getAttribute('placeholder');
  expect(searchPlaceholder, 'Search placeholder should be in Japanese').toContain('検索');

  // Verify logout button is in Japanese
  const uiTexts = await this.dashboardPage.getUITextsInCurrentLanguage();
  expect(uiTexts.logoutButton, 'Logout button should be in Japanese').toContain('ログアウト');
});

Then('the product names should be displayed in Japanese', async function(this: CustomWorld) {
  // Get visible product names
  const products = await this.page.locator('.product-card:visible .product-name').all();
  expect(products.length, 'Should have at least one visible product').toBeGreaterThan(0);

  // Check that product names contain Japanese characters (hiragana, katakana, or kanji)
  const japanesePattern = /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/;
  for (const product of products) {
    const name = await product.textContent();
    expect(
      japanesePattern.test(name || ''),
      `Product name "${name}" should contain Japanese characters`
    ).toBe(true);
  }
});

Then('the cart item should display {string}', async function(this: CustomWorld, expectedName: string) {
  const cartItemName = await this.page.locator('.cart-item-name, .cart-item .item-name').first().textContent();
  expect(cartItemName?.trim(), `Cart item should display "${expectedName}"`).toContain(expectedName);
});

Then('form labels should be in Japanese', async function(this: CustomWorld) {
  // Check for Japanese text in form labels and placeholders
  const japanesePattern = /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/;

  // Check form labels
  const formLabels = await this.page.locator('#checkout-modal label, .checkout-steps label, .shipping-form label').allTextContents();

  // Also check input placeholders
  const placeholders = await this.page.locator('#checkout-modal input').evaluateAll(inputs =>
    inputs.map(input => input.getAttribute('placeholder') || '')
  );

  // Check step labels
  const stepLabels = await this.page.locator('.step-label, .checkout-step-title').allTextContents();

  const allTexts = [...formLabels, ...placeholders, ...stepLabels].filter(t => t.trim());
  const hasJapanese = allTexts.some(text => japanesePattern.test(text));

  expect(hasJapanese, `Form should contain Japanese text. Found: ${allTexts.slice(0, 5).join(', ')}`).toBe(true);
});

Then('the error {string} should be visible', async function(this: CustomWorld, errorMessage: string) {
  const errorElement = this.page.locator(`.error-message:has-text("${errorMessage}"), .validation-error:has-text("${errorMessage}"), [class*="error"]:has-text("${errorMessage}")`);
  await expect(errorElement.first()).toBeVisible({ timeout: 5000 });
});

// Note: 'the page is reloaded' step is defined in checkout.steps.ts

When('the user views the product catalog', async function(this: CustomWorld) {
  // Ensure we're on the dashboard with products visible
  await this.dashboardPage.waitForPageLoad();

  // Wait for products to be rendered
  await this.page.waitForSelector('.product-card', { timeout: 10000 });
});

Then('the product {string} should be visible', async function(this: CustomWorld, productName: string) {
  // Get all visible product names
  const products = await this.page.locator('.product-card:visible .product-name').all();
  const productNames: string[] = [];

  for (const product of products) {
    const name = await product.textContent();
    if (name) productNames.push(name.trim());
  }

  const hasProduct = productNames.some(name => name.includes(productName));
  expect(
    hasProduct,
    `Product "${productName}" should be visible. Found products: ${productNames.slice(0, 10).join(', ')}...`
  ).toBe(true);
});
