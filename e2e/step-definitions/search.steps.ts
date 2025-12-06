import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

// When Steps
When('the user searches for {string}', async function(this: CustomWorld, searchTerm: string) {
  await this.dashboardPage.searchProducts(searchTerm);
});

When('the user filters by category {string}', async function(this: CustomWorld, category: string) {
  await this.dashboardPage.applyFilter('category', category);
});

When('the user sorts products by price {string}', async function(this: CustomWorld, order: string) {
  const sortValue = order === 'asc' ? 'price-low' : 'price-high';
  await this.page.locator('#sort-select').selectOption(sortValue);
  await this.page.waitForTimeout(500);
});

// Then Steps
Then('the search results should contain {string}', async function(this: CustomWorld, productName: string) {
  // Wait for search to complete
  await this.page.waitForTimeout(500);

  // Get visible product names
  const products = await this.page.locator('.product-card:visible .product-name').all();
  const names: string[] = [];
  for (const product of products) {
    const name = await product.textContent();
    if (name) names.push(name.trim());
  }

  const hasProduct = names.some(name => name.includes(productName));
  expect(hasProduct, `Search results should contain "${productName}", found: ${names.join(', ')}`).toBe(true);
});

Then('only products in {string} category should be displayed', async function(this: CustomWorld, category: string) {
  // Get all visible products
  const products = await this.page.locator('.product-card:visible').all();

  // Verify each product has the correct category
  for (const product of products) {
    const categoryText = await product.locator('.product-category').textContent();
    expect(
      categoryText?.toLowerCase().includes(category.toLowerCase()),
      `Product should be in ${category} category`
    ).toBe(true);
  }
});

Then('products should be displayed in ascending price order', async function(this: CustomWorld) {
  const products = await this.page.locator('.product-card:visible').all();
  const prices: number[] = [];

  for (const product of products) {
    const priceText = await product.locator('.product-price').textContent();
    const price = parseFloat(priceText?.replace(/[^\d]/g, '') || '0');
    prices.push(price);
  }

  // Check if prices are in ascending order
  for (let i = 1; i < prices.length; i++) {
    expect(prices[i], `Price at index ${i} should be >= price at index ${i-1}`).toBeGreaterThanOrEqual(prices[i-1]);
  }
});
