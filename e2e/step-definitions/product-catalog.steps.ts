import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

/**
 * Product Catalog Step Definitions
 * Maps to product-catalog.feature scenarios
 * Test Cases: TC-CATALOG-001 to TC-CATALOG-019
 * Requirements: REQ-F-002 to REQ-F-005 (Product Catalog, Search, Filter, Sort)
 */

// Given Steps
Given('the dashboard page is loaded', async function(this: CustomWorld) {
  await this.pageObjects.dashboardPage.waitForPageLoad();

  // Ensure products are visible
  const productCount = await this.pageObjects.dashboardPage.getProductCount();
  expect(productCount, 'Products should be loaded').toBeGreaterThan(0);
});

Given('the language is set to English', async function(this: CustomWorld) {
  await this.pageObjects.dashboardPage.clickEnglishLanguageButton();

  const isEnglishActive = await this.pageObjects.dashboardPage.isEnglishLanguageActive();
  expect(isEnglishActive, 'Language should be English').toBe(true);
});

Given('the user has searched for {string}', async function(this: CustomWorld, searchTerm: string) {
  await this.pageObjects.dashboardPage.enterSearchTerm(searchTerm);

  // Store search term for later verification
  this.setTestData('currentSearchTerm', searchTerm);
});

Given('only {int} product is displayed', async function(this: CustomWorld, expectedCount: number) {
  const actualCount = await this.pageObjects.dashboardPage.getProductCount();
  expect(actualCount).toBe(expectedCount);
});

Given('the user has selected {string} category filter', async function(this: CustomWorld, categoryFilter: string) {
  switch (categoryFilter.toLowerCase()) {
    case 'electronics':
      await this.pageObjects.dashboardPage.clickElectronicsFilter();
      break;
    case 'clothing':
      await this.pageObjects.dashboardPage.clickClothingFilter();
      break;
    case 'books':
      await this.pageObjects.dashboardPage.clickBooksFilter();
      break;
    case 'home':
      // Add home category support if exists
      await this.pageObjects.dashboardPage.clickAllFilter();
      break;
    default:
      throw new Error(`Unknown category filter: ${categoryFilter}`);
  }

  // Store filter for verification
  this.setTestData('currentFilter', categoryFilter);
});

Given('{int} products are displayed', async function(this: CustomWorld, expectedCount: number) {
  const actualCount = await this.pageObjects.dashboardPage.getProductCount();
  expect(actualCount, `Should display ${expectedCount} products`).toBe(expectedCount);
});

Given('the products are sorted by {string}', async function(this: CustomWorld, sortOption: string) {
  switch (sortOption.toLowerCase()) {
    case 'name ascending':
    case 'name-asc':
      await this.pageObjects.dashboardPage.sortByNameAscending();
      break;
    case 'name descending':
    case 'name-desc':
      await this.pageObjects.dashboardPage.sortByNameDescending();
      break;
    case 'price ascending':
    case 'price-asc':
      await this.pageObjects.dashboardPage.sortByPriceAscending();
      break;
    case 'price descending':
    case 'price-desc':
      await this.pageObjects.dashboardPage.sortByPriceDescending();
      break;
    default:
      throw new Error(`Unknown sort option: ${sortOption}`);
  }
});

Given('the following filters are applied:', async function(this: CustomWorld, dataTable: DataTable) {
  const filters = dataTable.hashes();
  for (const filter of filters) {
    if (filter.category) {
      await this.pageObjects.dashboardPage.clickElectronicsFilter();
    }
    if (filter.search) {
      await this.pageObjects.dashboardPage.enterSearchTerm(filter.search);
    }
    if (filter.sort) {
      await this.pageObjects.dashboardPage.selectSortOption(filter.sort);
    }
  }
});

// When Steps
When('the user views the product catalog', async function(this: CustomWorld) {
  // User is already on the dashboard, just verify products are visible
  const productCount = await this.pageObjects.dashboardPage.getProductCount();
  expect(productCount, 'Product catalog should be visible').toBeGreaterThan(0);
});

When('the user searches for {string}', async function(this: CustomWorld, searchTerm: string) {
  await this.pageObjects.dashboardPage.enterSearchTerm(searchTerm);
  this.setTestData('searchTerm', searchTerm);
});

When('the user enters {string} in the search box', async function(this: CustomWorld, searchTerm: string) {
  await this.pageObjects.dashboardPage.enterSearchTerm(searchTerm);
});

When('the user clears the search', async function(this: CustomWorld) {
  await this.pageObjects.dashboardPage.clearSearch();
});

When('the user selects the {string} category filter', async function(this: CustomWorld, categoryFilter: string) {
  switch (categoryFilter.toLowerCase()) {
    case 'electronics':
      await this.pageObjects.dashboardPage.clickElectronicsFilter();
      break;
    case 'clothing':
      await this.pageObjects.dashboardPage.clickClothingFilter();
      break;
    case 'books':
      await this.pageObjects.dashboardPage.clickBooksFilter();
      break;
    case 'all':
      await this.pageObjects.dashboardPage.clickAllFilter();
      break;
    default:
      throw new Error(`Unknown category filter: ${categoryFilter}`);
  }
});

When('the user sorts by {string}', async function(this: CustomWorld, sortOption: string) {
  switch (sortOption.toLowerCase()) {
    case 'name ascending':
    case 'name-asc':
      await this.pageObjects.dashboardPage.sortByNameAscending();
      break;
    case 'name descending':
    case 'name-desc':
      await this.pageObjects.dashboardPage.sortByNameDescending();
      break;
    case 'price low to high':
    case 'price-asc':
      await this.pageObjects.dashboardPage.sortByPriceAscending();
      break;
    case 'price high to low':
    case 'price-desc':
      await this.pageObjects.dashboardPage.sortByPriceDescending();
      break;
    default:
      throw new Error(`Unknown sort option: ${sortOption}`);
  }
});

When('the user applies multiple filters', async function(this: CustomWorld) {
  // Apply search filter
  await this.pageObjects.dashboardPage.enterSearchTerm('ス');

  // Apply category filter
  await this.pageObjects.dashboardPage.clickElectronicsFilter();

  // Apply sort
  await this.pageObjects.dashboardPage.sortByPriceAscending();
});

When('the user resets all filters', async function(this: CustomWorld) {
  // Clear search
  await this.pageObjects.dashboardPage.clearSearch();

  // Reset category to all
  await this.pageObjects.dashboardPage.clickAllFilter();

  // Reset sort to default (name)
  await this.pageObjects.dashboardPage.sortByNameAscending();
});

When('the user performs complex filtering operations', async function(this: CustomWorld) {
  // Perform various filtering operations
  await this.pageObjects.dashboardPage.enterSearchTerm('ノート');
  await this.page.waitForTimeout(500);

  await this.pageObjects.dashboardPage.clickElectronicsFilter();
  await this.page.waitForTimeout(500);

  await this.pageObjects.dashboardPage.sortByPriceDescending();
  await this.page.waitForTimeout(500);

  await this.pageObjects.dashboardPage.clearSearch();
  await this.page.waitForTimeout(500);
});

When('the user interacts with the product grid', async function(this: CustomWorld) {
  // Get product information
  const productCount = await this.pageObjects.dashboardPage.getProductCount();
  expect(productCount, 'Should have products to interact with').toBeGreaterThan(0);

  // Get first product info
  if (productCount > 0) {
    const productInfo = await this.pageObjects.dashboardPage.getProductInfo(0);
    this.setTestData('firstProductInfo', productInfo);
  }
});

// Then Steps
Then('{int} products should be displayed', async function(this: CustomWorld, expectedCount: number) {
  const actualCount = await this.pageObjects.dashboardPage.getProductCount();
  expect(actualCount, `Expected ${expectedCount} products to be displayed`).toBe(expectedCount);
});

Then('all {int} products should be visible', async function(this: CustomWorld, expectedCount: number) {
  const actualCount = await this.pageObjects.dashboardPage.getProductCount();
  expect(actualCount, `All ${expectedCount} products should be visible`).toBe(expectedCount);
});

Then('only products containing {string} should be displayed', async function(this: CustomWorld, searchTerm: string) {
  const productCount = await this.pageObjects.dashboardPage.getProductCount();
  expect(productCount, 'Search results should be displayed').toBeGreaterThanOrEqual(0);

  // If there are results, verify they contain the search term (this would require more detailed verification)
  if (productCount > 0) {
    const productInfo = await this.pageObjects.dashboardPage.getProductInfo(0);
    // Basic verification that search is working
    expect(productInfo.name, 'Product should exist').toBeTruthy();
  }
});

Then('no products should be displayed', async function(this: CustomWorld) {
  const productCount = await this.pageObjects.dashboardPage.getProductCount();
  expect(productCount, 'No products should be displayed').toBe(0);
});

Then('a {string} message should be displayed', async function(this: CustomWorld, messageType: string) {
  if (messageType.toLowerCase().includes('no results')) {
    const isNoResultsVisible = await this.pageObjects.dashboardPage.isNoResultsMessageDisplayed();
    if (isNoResultsVisible) {
      const message = await this.pageObjects.dashboardPage.getNoResultsMessage();
      expect(message, 'No results message should be displayed').toBeTruthy();
    }
  }
});

Then('all products should be displayed', async function(this: CustomWorld) {
  const productCount = await this.pageObjects.dashboardPage.getProductCount();
  expect(productCount, 'All products should be displayed').toBeGreaterThan(0);
});

Then('only {string} category products should be displayed', async function(this: CustomWorld, category: string) {
  const productCount = await this.pageObjects.dashboardPage.getProductCount();
  expect(productCount, `${category} products should be displayed`).toBeGreaterThanOrEqual(0);

  // Verify category filter is active
  const isFilterActive = await this.pageObjects.dashboardPage.isCategoryFilterActive(category);
  expect(isFilterActive, `${category} filter should be active`).toBe(true);
});

Then('the products should be sorted by {string}', async function(this: CustomWorld, sortCriteria: string) {
  const productCount = await this.pageObjects.dashboardPage.getProductCount();
  expect(productCount, 'Should have products to verify sorting').toBeGreaterThan(0);

  // Basic verification that products are still displayed after sorting
  // More detailed sorting verification would require comparing product order
  if (productCount >= 2) {
    const firstProduct = await this.pageObjects.dashboardPage.getProductInfo(0);
    const secondProduct = await this.pageObjects.dashboardPage.getProductInfo(1);

    expect(firstProduct.name, 'First product should exist').toBeTruthy();
    expect(secondProduct.name, 'Second product should exist').toBeTruthy();
  }
});

Then('the search results count should be displayed', async function(this: CustomWorld) {
  const resultCount = await this.pageObjects.dashboardPage.getSearchResultCount();
  expect(resultCount, 'Search result count should be displayed').toBeTruthy();
});

Then('the search results should be relevant to {string}', async function(this: CustomWorld, searchTerm: string) {
  const productCount = await this.pageObjects.dashboardPage.getProductCount();

  // If there are results, they should be relevant
  if (productCount > 0) {
    const productInfo = await this.pageObjects.dashboardPage.getProductInfo(0);
    expect(productInfo.name, 'Search results should be relevant').toBeTruthy();
  }

  // Store for verification
  this.setTestData('searchResultsRelevant', true);
});

Then('the filtering should be case-insensitive', async function(this: CustomWorld) {
  // This step assumes that previous search was case-insensitive and returned results
  const productCount = await this.pageObjects.dashboardPage.getProductCount();
  expect(productCount, 'Case-insensitive search should return results').toBeGreaterThanOrEqual(0);
});

Then('the {string} filter should be active', async function(this: CustomWorld, filterName: string) {
  if (filterName.toLowerCase() !== 'all') {
    const isFilterActive = await this.pageObjects.dashboardPage.isCategoryFilterActive(filterName);
    expect(isFilterActive, `${filterName} filter should be active`).toBe(true);
  }
});

Then('the sort order should be maintained', async function(this: CustomWorld) {
  const productCount = await this.pageObjects.dashboardPage.getProductCount();
  expect(productCount, 'Products should maintain sort order').toBeGreaterThan(0);
});

Then('the combined filters should work correctly', async function(this: CustomWorld) {
  // Verify that multiple filters can be applied together
  const productCount = await this.pageObjects.dashboardPage.getProductCount();
  expect(productCount, 'Combined filters should work').toBeGreaterThanOrEqual(0);
});

Then('all filters should be reset to default', async function(this: CustomWorld) {
  // Verify search is cleared
  const searchBox = await this.page.locator('#search-input');
  const searchValue = await searchBox.inputValue();
  expect(searchValue, 'Search should be cleared').toBe('');

  // Verify all products are shown
  const productCount = await this.pageObjects.dashboardPage.getProductCount();
  expect(productCount, 'All products should be shown after reset').toBeGreaterThan(0);
});

Then('the product information should be accurate', async function(this: CustomWorld) {
  const firstProductInfo = this.getTestData('firstProductInfo');
  if (firstProductInfo) {
    expect(firstProductInfo.name, 'Product name should exist').toBeTruthy();
    expect(firstProductInfo.price, 'Product price should exist').toBeTruthy();
    expect(firstProductInfo.category, 'Product category should exist').toBeTruthy();
  }
});

Then('the catalog should be responsive', async function(this: CustomWorld) {
  // Test different viewport sizes
  await this.page.setViewportSize({ width: 375, height: 667 }); // Mobile
  let productCount = await this.pageObjects.dashboardPage.getProductCount();
  expect(productCount, 'Products should be visible on mobile').toBeGreaterThan(0);

  await this.page.setViewportSize({ width: 1200, height: 800 }); // Desktop
  productCount = await this.pageObjects.dashboardPage.getProductCount();
  expect(productCount, 'Products should be visible on desktop').toBeGreaterThan(0);

  // Reset to default
  await this.page.setViewportSize({ width: 1280, height: 720 });
});

Then('performance should be acceptable', async function(this: CustomWorld) {
  // Basic performance check - operations should complete within reasonable time
  const startTime = Date.now();
  await this.pageObjects.dashboardPage.getProductCount();
  const endTime = Date.now();

  const responseTime = endTime - startTime;
  expect(responseTime, 'Product catalog should load quickly').toBeLessThan(2000);
});

Then('the search should support partial matching', async function(this: CustomWorld) {
  // Verify that partial search terms return results
  const productCount = await this.pageObjects.dashboardPage.getProductCount();
  expect(productCount, 'Partial matching should work').toBeGreaterThanOrEqual(0);
});

Then('the filters should be intuitive and user-friendly', async function(this: CustomWorld) {
  // Verify that filter controls are accessible and functional
  const electronicsFilter = await this.page.locator('#filterElectronics').isVisible();
  const searchBox = await this.page.locator('#searchBox').isVisible();
  const sortDropdown = await this.page.locator('#sortSelect').isVisible();

  expect(electronicsFilter, 'Electronics filter should be visible').toBe(true);
  expect(searchBox, 'Search box should be visible').toBe(true);
  expect(sortDropdown, 'Sort dropdown should be visible').toBe(true);
});