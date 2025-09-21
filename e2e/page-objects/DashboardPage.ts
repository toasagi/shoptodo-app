import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Dashboard Page Object - Main application page after login
 * Maps to: TC-CATALOG-001 to TC-CATALOG-019, TC-CART-001 to TC-CART-004, TC-TODO-001 to TC-TODO-008
 * Requirements: REQ-F-002 to REQ-F-009 (Product Catalog, Shopping Cart, Todo List)
 * User Stories: US-004 to US-012
 */
export class DashboardPage extends BasePage {
  // Header Elements
  private readonly header: Locator;
  private readonly usernameDisplay: Locator;
  private readonly logoutButton: Locator;
  private readonly languageJpButton: Locator;
  private readonly languageEnButton: Locator;
  private readonly cartIcon: Locator;
  private readonly cartItemCount: Locator;

  // Search and Filter Elements
  private readonly searchBox: Locator;
  private readonly searchResultCount: Locator;
  private readonly categoryFilterAll: Locator;
  private readonly categoryFilterElectronics: Locator;
  private readonly categoryFilterClothing: Locator;
  private readonly categoryFilterBooks: Locator;
  private readonly categoryFilterHome: Locator;
  private readonly sortDropdown: Locator;

  // Product Grid Elements
  private readonly productGrid: Locator;
  private readonly productItems: Locator;
  private readonly noResultsMessage: Locator;

  // Todo List Elements
  private readonly todoSection: Locator;
  private readonly todoInput: Locator;
  private readonly todoAddButton: Locator;
  private readonly todoList: Locator;
  private readonly todoItems: Locator;

  constructor(page: Page) {
    super(page, '/');

    // Header elements
    this.header = this.page.locator('header');
    this.usernameDisplay = this.page.locator('#userDisplay');
    this.logoutButton = this.page.locator('#logoutBtn');
    this.languageJpButton = this.page.locator('#langJp');
    this.languageEnButton = this.page.locator('#langEn');
    this.cartIcon = this.page.locator('#cartIcon');
    this.cartItemCount = this.page.locator('#cartItemCount');

    // Search and filter elements
    this.searchBox = this.page.locator('#searchBox');
    this.searchResultCount = this.page.locator('#searchResultCount');
    this.categoryFilterAll = this.page.locator('#filterAll');
    this.categoryFilterElectronics = this.page.locator('#filterElectronics');
    this.categoryFilterClothing = this.page.locator('#filterClothing');
    this.categoryFilterBooks = this.page.locator('#filterBooks');
    this.categoryFilterHome = this.page.locator('#filterHome');
    this.sortDropdown = this.page.locator('#sortSelect');

    // Product grid elements
    this.productGrid = this.page.locator('#productGrid');
    this.productItems = this.page.locator('.product-item');
    this.noResultsMessage = this.page.locator('#noResultsMessage');

    // Todo list elements
    this.todoSection = this.page.locator('#todoSection');
    this.todoInput = this.page.locator('#todoInput');
    this.todoAddButton = this.page.locator('#todoAddBtn');
    this.todoList = this.page.locator('#todoList');
    this.todoItems = this.page.locator('.todo-item');
  }

  // Authentication Methods

  /**
   * TC-AUTH-007: Logout functionality
   * Click logout button
   */
  async clickLogoutButton(): Promise<void> {
    await this.clickElement(this.logoutButton);
  }

  /**
   * TC-AUTH-001: Check if user is logged in
   * Get displayed username
   */
  async getDisplayedUsername(): Promise<string> {
    return await this.getElementText(this.usernameDisplay);
  }

  /**
   * Check if logout button is visible
   */
  async isLogoutButtonVisible(): Promise<boolean> {
    return await this.isElementVisible(this.logoutButton);
  }

  // Product Catalog Methods

  /**
   * TC-CATALOG-001: Initial product display
   * Get total number of displayed products
   */
  async getProductCount(): Promise<number> {
    await this.waitForElementVisible(this.productGrid);
    return await this.productItems.count();
  }

  /**
   * TC-CATALOG-001: Product data integrity
   * Get product information by index
   */
  async getProductInfo(index: number): Promise<{
    name: string;
    price: string;
    category: string;
  }> {
    const productItem = this.productItems.nth(index);
    await this.waitForElementVisible(productItem);

    const name = await productItem.locator('.product-name').textContent() || '';
    const price = await productItem.locator('.product-price').textContent() || '';
    const category = await productItem.locator('.product-category').textContent() || '';

    return { name, price, category };
  }

  /**
   * TC-CATALOG-003 to TC-CATALOG-008: Search functionality
   * Enter search term
   */
  async enterSearchTerm(searchTerm: string): Promise<void> {
    await this.fillInput(this.searchBox, searchTerm);
    // Wait for search results to update
    await this.page.waitForTimeout(500);
  }

  /**
   * TC-CATALOG-006: Clear search
   * Clear search box
   */
  async clearSearch(): Promise<void> {
    await this.searchBox.clear();
    await this.page.waitForTimeout(500);
  }

  /**
   * TC-CATALOG-004, TC-CATALOG-006: Search results
   * Get search result count text
   */
  async getSearchResultCount(): Promise<string> {
    return await this.getElementText(this.searchResultCount);
  }

  /**
   * TC-CATALOG-006: No results message
   * Check if no results message is displayed
   */
  async isNoResultsMessageDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.noResultsMessage);
  }

  /**
   * TC-CATALOG-006: No results message
   * Get no results message text
   */
  async getNoResultsMessage(): Promise<string> {
    return await this.getElementText(this.noResultsMessage);
  }

  // Category Filter Methods

  /**
   * TC-CATALOG-009: Single category filter
   * Click electronics category filter
   */
  async clickElectronicsFilter(): Promise<void> {
    await this.clickElement(this.categoryFilterElectronics);
    await this.page.waitForTimeout(500);
  }

  /**
   * TC-CATALOG-010: Single category filter
   * Click clothing category filter
   */
  async clickClothingFilter(): Promise<void> {
    await this.clickElement(this.categoryFilterClothing);
    await this.page.waitForTimeout(500);
  }

  /**
   * TC-CATALOG-011: Multiple category filter
   * Click books category filter
   */
  async clickBooksFilter(): Promise<void> {
    await this.clickElement(this.categoryFilterBooks);
    await this.page.waitForTimeout(500);
  }

  /**
   * TC-CATALOG-012: Clear filters
   * Click all category filter
   */
  async clickAllFilter(): Promise<void> {
    await this.clickElement(this.categoryFilterAll);
    await this.page.waitForTimeout(500);
  }

  /**
   * Check if category filter is active
   */
  async isCategoryFilterActive(category: string): Promise<boolean> {
    const filterElement = this.page.locator(`#filter${category.charAt(0).toUpperCase() + category.slice(1)}`);
    const classList = await filterElement.getAttribute('class') || '';
    return classList.includes('active');
  }

  // Sort Methods

  /**
   * TC-CATALOG-013 to TC-CATALOG-016: Sort functionality
   * Select sort option
   */
  async selectSortOption(sortOption: string): Promise<void> {
    await this.sortDropdown.selectOption(sortOption);
    await this.page.waitForTimeout(500);
  }

  /**
   * TC-CATALOG-015: Price ascending sort
   * Sort by price (low to high)
   */
  async sortByPriceAscending(): Promise<void> {
    await this.selectSortOption('price-asc');
  }

  /**
   * TC-CATALOG-016: Price descending sort
   * Sort by price (high to low)
   */
  async sortByPriceDescending(): Promise<void> {
    await this.selectSortOption('price-desc');
  }

  /**
   * TC-CATALOG-013: Name ascending sort
   * Sort by name (A to Z)
   */
  async sortByNameAscending(): Promise<void> {
    await this.selectSortOption('name-asc');
  }

  /**
   * TC-CATALOG-014: Name descending sort
   * Sort by name (Z to A)
   */
  async sortByNameDescending(): Promise<void> {
    await this.selectSortOption('name-desc');
  }

  // Shopping Cart Methods

  /**
   * TC-CART-001, TC-CART-002: Add to cart
   * Add product to cart by product name
   */
  async addProductToCart(productName: string): Promise<void> {
    const productItem = this.page.locator('.product-item').filter({ hasText: productName });
    const addToCartButton = productItem.locator('.add-to-cart-btn');
    await this.clickElement(addToCartButton);
    await this.page.waitForTimeout(500);
  }

  /**
   * TC-CART-001: Get cart item count
   */
  async getCartItemCount(): Promise<string> {
    return await this.getElementText(this.cartItemCount);
  }

  /**
   * Check if cart item count badge is visible
   */
  async isCartItemCountVisible(): Promise<boolean> {
    return await this.isElementVisible(this.cartItemCount);
  }

  /**
   * Click cart icon to navigate to cart page
   */
  async clickCartIcon(): Promise<void> {
    await this.clickElement(this.cartIcon);
  }

  // Todo List Methods

  /**
   * TC-TODO-001: Add new todo
   * Enter todo text
   */
  async enterTodoText(todoText: string): Promise<void> {
    await this.fillInput(this.todoInput, todoText);
  }

  /**
   * TC-TODO-001: Add new todo
   * Click add todo button
   */
  async clickAddTodoButton(): Promise<void> {
    await this.clickElement(this.todoAddButton);
  }

  /**
   * TC-TODO-001: Add new todo
   * Add todo item
   */
  async addTodoItem(todoText: string): Promise<void> {
    await this.enterTodoText(todoText);
    await this.clickAddTodoButton();
    await this.page.waitForTimeout(500);
  }

  /**
   * TC-TODO-005: Toggle todo completion
   * Toggle todo completion by text
   */
  async toggleTodoCompletion(todoText: string): Promise<void> {
    const todoItem = this.page.locator('.todo-item').filter({ hasText: todoText });
    const checkbox = todoItem.locator('input[type="checkbox"]');
    await this.clickElement(checkbox);
    await this.page.waitForTimeout(500);
  }

  /**
   * TC-TODO-007: Delete todo
   * Delete todo by text
   */
  async deleteTodoItem(todoText: string): Promise<void> {
    const todoItem = this.page.locator('.todo-item').filter({ hasText: todoText });
    const deleteButton = todoItem.locator('.delete-btn');
    await this.clickElement(deleteButton);
    await this.page.waitForTimeout(500);
  }

  /**
   * Get number of todo items
   */
  async getTodoItemCount(): Promise<number> {
    return await this.todoItems.count();
  }

  /**
   * Check if todo item exists
   */
  async isTodoItemExists(todoText: string): Promise<boolean> {
    const todoItem = this.page.locator('.todo-item').filter({ hasText: todoText });
    return await this.isElementVisible(todoItem);
  }

  /**
   * Check if todo item is completed
   */
  async isTodoItemCompleted(todoText: string): Promise<boolean> {
    const todoItem = this.page.locator('.todo-item').filter({ hasText: todoText });
    const checkbox = todoItem.locator('input[type="checkbox"]');
    return await checkbox.isChecked();
  }

  // Language Methods

  /**
   * TC-LANG-001: Switch to English
   * Click English language button
   */
  async clickEnglishLanguageButton(): Promise<void> {
    await this.clickElement(this.languageEnButton);
    await this.page.waitForTimeout(1000); // Wait for language switch
  }

  /**
   * TC-LANG-002: Switch to Japanese
   * Click Japanese language button
   */
  async clickJapaneseLanguageButton(): Promise<void> {
    await this.clickElement(this.languageJpButton);
    await this.page.waitForTimeout(1000); // Wait for language switch
  }

  /**
   * Check if English language button is active
   */
  async isEnglishLanguageActive(): Promise<boolean> {
    const classList = await this.languageEnButton.getAttribute('class') || '';
    return classList.includes('active');
  }

  /**
   * Check if Japanese language button is active
   */
  async isJapaneseLanguageActive(): Promise<boolean> {
    const classList = await this.languageJpButton.getAttribute('class') || '';
    return classList.includes('active');
  }

  // Validation Methods

  /**
   * TC-CATALOG-001: Assert initial product display
   */
  async assertInitialProductDisplay(): Promise<void> {
    const productCount = await this.getProductCount();
    if (productCount !== 12) {
      throw new Error(`Expected 12 products, but found ${productCount}`);
    }

    await this.assertElementVisible(this.productGrid, 'Product grid should be visible');
  }

  /**
   * TC-CATALOG-003 to TC-CATALOG-008: Assert search results
   */
  async assertSearchResults(expectedCount: number, searchTerm?: string): Promise<void> {
    const productCount = await this.getProductCount();
    if (productCount !== expectedCount) {
      throw new Error(`Expected ${expectedCount} search results, but found ${productCount} for term "${searchTerm}"`);
    }
  }

  /**
   * TC-CART-001: Assert cart item count
   */
  async assertCartItemCount(expectedCount: string): Promise<void> {
    await this.assertElementContainsText(this.cartItemCount, expectedCount,
      `Cart should contain ${expectedCount} items`);
  }

  /**
   * TC-TODO-001: Assert todo item added
   */
  async assertTodoItemAdded(todoText: string): Promise<void> {
    const exists = await this.isTodoItemExists(todoText);
    if (!exists) {
      throw new Error(`Todo item "${todoText}" should be added to the list`);
    }
  }

  /**
   * TC-LANG-001, TC-LANG-002: Assert language switch
   */
  async assertLanguageSwitch(language: 'en' | 'jp'): Promise<void> {
    if (language === 'en') {
      if (!(await this.isEnglishLanguageActive())) {
        throw new Error('English language button should be active');
      }
    } else {
      if (!(await this.isJapaneseLanguageActive())) {
        throw new Error('Japanese language button should be active');
      }
    }
  }
}