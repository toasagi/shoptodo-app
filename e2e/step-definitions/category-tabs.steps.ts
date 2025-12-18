import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

// Then Steps - Category Tabs Visibility
Then('the category tabs should be visible', async function(this: CustomWorld) {
  const tabs = this.page.locator('.category-tabs');
  await expect(tabs).toBeVisible();
});

Then('the following category tabs should be present:', async function(this: CustomWorld, dataTable: any) {
  const expectedTabs = dataTable.hashes().map((row: any) => row.tab);

  for (const tabName of expectedTabs) {
    const tab = this.page.locator('.category-tab', { hasText: tabName });
    await expect(tab, `Tab "${tabName}" should be present`).toBeVisible();
  }
});

// Then Steps - Active Tab
Then('the {string} tab should be active', async function(this: CustomWorld, tabName: string) {
  const tab = this.page.locator('.category-tab', { hasText: tabName });
  await expect(tab).toHaveClass(/active/);
});

Then('all products should be displayed', async function(this: CustomWorld) {
  // When "All Products" tab is active, there should be more products than any single category
  const productCount = await this.page.locator('.product-card:visible').count();
  expect(productCount, 'All products should be displayed').toBeGreaterThan(10);
});

// When Steps - Click Category Tab
When('the user clicks the {string} category tab', async function(this: CustomWorld, tabName: string) {
  const tab = this.page.locator('.category-tab', { hasText: tabName });
  await tab.click();
  await this.page.waitForTimeout(500);
});

// Given Steps - Tab State
Given('the user has clicked the {string} category tab', async function(this: CustomWorld, tabName: string) {
  const tab = this.page.locator('.category-tab', { hasText: tabName });
  await tab.click();
  await this.page.waitForTimeout(500);
});

// Then Steps - Category Filtering (reuses existing step but with tab context)
Then('only products matching {string} in {string} category should be displayed', async function(
  this: CustomWorld,
  searchTerm: string,
  category: string
) {
  // Wait for search filtering to complete
  await this.page.waitForTimeout(1000);

  const products = await this.page.locator('.product-card:visible').all();

  // Category name mapping
  const categoryMap: Record<string, string[]> = {
    'electronics': ['electronics', '電子機器'],
    'clothing': ['clothing', '衣類'],
    'books': ['books', '書籍'],
    'home': ['home', 'ホーム'],
  };
  const validCategoryNames = categoryMap[category.toLowerCase()] || [category];

  // Collect all product info for debugging
  const productInfos: string[] = [];
  for (const product of products) {
    const name = await product.locator('.product-name').textContent();
    const cat = await product.locator('.product-category').textContent();
    productInfos.push(`${name} (${cat})`);
  }

  // Verify we have at least one matching product
  expect(products.length, `Should have products matching "${searchTerm}" in ${category}. Found: ${productInfos.join(', ')}`).toBeGreaterThan(0);

  for (const product of products) {
    // Check category
    const categoryText = await product.locator('.product-category').textContent();
    const categoryMatches = validCategoryNames.some(name =>
      categoryText?.toLowerCase().includes(name.toLowerCase())
    );
    expect(categoryMatches, `Product should be in ${category} category`).toBe(true);

    // Check search term in name
    const productName = await product.locator('.product-name').textContent();
    expect(
      productName?.includes(searchTerm),
      `Product name "${productName}" should contain "${searchTerm}". Visible products: ${productInfos.join(', ')}`
    ).toBe(true);
  }
});

// When Steps - Add first product
When('the user adds the first product in the list to cart', async function(this: CustomWorld) {
  const firstProduct = this.page.locator('.product-card:visible').first();
  await firstProduct.locator('button.btn-primary').click();
  await this.page.waitForTimeout(500);
});

// Then Steps - Cart count
Then('the cart should contain {int} items', async function(this: CustomWorld, count: number) {
  const cartItems = await this.page.locator('.cart-item').count();
  expect(cartItems, `Cart should contain ${count} items`).toBe(count);
});

// Note: "the product names should be displayed in Japanese" step is defined in language.steps.ts
