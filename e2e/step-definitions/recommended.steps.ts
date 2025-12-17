import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

// Then Steps - Recommended Section
Then('the recommended section should be visible', async function(this: CustomWorld) {
  const section = this.page.locator('.recommended-section');
  await expect(section).toBeVisible();
});

Then('the recommended section should contain {int} products', async function(this: CustomWorld, count: number) {
  const products = await this.page.locator('.recommended-card').count();
  expect(products, `Recommended section should contain ${count} products`).toBe(count);
});

Then('the recommended section should contain products from all categories:', async function(this: CustomWorld, dataTable: any) {
  const expectedCategories = dataTable.hashes().map((row: any) => row.category);

  const recommendedCards = await this.page.locator('.recommended-card').all();
  const foundCategories: string[] = [];

  for (const card of recommendedCards) {
    const categoryText = await card.locator('.recommended-category').textContent();
    if (categoryText) {
      // Extract category from text (may include icon)
      const categoryLower = categoryText.toLowerCase();
      if (categoryLower.includes('electronics') || categoryLower.includes('電子機器')) {
        foundCategories.push('electronics');
      } else if (categoryLower.includes('clothing') || categoryLower.includes('衣類')) {
        foundCategories.push('clothing');
      } else if (categoryLower.includes('books') || categoryLower.includes('書籍')) {
        foundCategories.push('books');
      } else if (categoryLower.includes('home') || categoryLower.includes('ホーム')) {
        foundCategories.push('home');
      }
    }
  }

  for (const expected of expectedCategories) {
    expect(
      foundCategories.includes(expected),
      `Recommended section should contain a product from ${expected} category`
    ).toBe(true);
  }
});

// When Steps - Add recommended product
When('the user adds the first recommended product to cart', async function(this: CustomWorld) {
  const firstCard = this.page.locator('.recommended-card').first();
  await firstCard.waitFor({ state: 'visible', timeout: 10000 });
  await firstCard.locator('button.btn-primary').click();
  await this.page.waitForTimeout(500);
});

When('the user tries to add a recommended product to cart', async function(this: CustomWorld) {
  const firstCard = this.page.locator('.recommended-card').first();
  await firstCard.waitFor({ state: 'visible', timeout: 10000 });
  const button = firstCard.locator('button.btn-primary');

  // Click even if disabled to trigger error
  await button.click({ force: true });
  await this.page.waitForTimeout(500);
});

// Then Steps - Messages
Then('a success message should be displayed', async function(this: CustomWorld) {
  const message = this.page.locator('.message-success');
  await expect(message).toBeVisible({ timeout: 3000 });
});

// Note: "an error message should be displayed" is defined in login.steps.ts

Then('the cart should remain empty', async function(this: CustomWorld) {
  const emptyCart = this.page.locator('.empty-cart');
  await expect(emptyCart).toBeVisible();
});

// Japanese UI Steps
Then('the recommended section title should be {string}', async function(this: CustomWorld, expectedTitle: string) {
  const title = await this.page.locator('.recommended-section h2').textContent();
  expect(title?.trim(), `Recommended section title should be "${expectedTitle}"`).toBe(expectedTitle);
});

Then('the recommended product names should be in Japanese', async function(this: CustomWorld) {
  const products = await this.page.locator('.recommended-card .recommended-name').all();

  for (const product of products) {
    const name = await product.textContent();
    // Check if contains Japanese characters (Hiragana, Katakana, or Kanji)
    const hasJapanese = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(name || '');
    expect(hasJapanese, `Product name "${name}" should contain Japanese characters`).toBe(true);
  }
});
