import * as fs from 'fs';
import * as path from 'path';

/**
 * Test Data Manager
 * Centralized management of test data for E2E tests
 * Supports JSON data loading, environment-specific data, and data generation
 */

export interface UserCredentials {
  username: string;
  password: string;
  displayName?: string;
  expectedError?: string;
}

export interface Product {
  id: number;
  name: string;
  price: string;
  category: string;
  description: string;
}

export interface TodoItem {
  text: string;
  completed: boolean;
  language: string;
}

export interface CartItem {
  productName: string;
  quantity: number;
  unitPrice?: number;
  subtotal?: number;
}

export interface SearchTerm {
  term: string;
  expectedResults: string[];
  resultCount: number;
}

export class TestDataManager {
  private static instance: TestDataManager;
  private testData: any;
  private dataPath: string;

  private constructor() {
    this.dataPath = path.join(__dirname, '../data/test-data.json');
    this.loadTestData();
  }

  public static getInstance(): TestDataManager {
    if (!TestDataManager.instance) {
      TestDataManager.instance = new TestDataManager();
    }
    return TestDataManager.instance;
  }

  /**
   * Load test data from JSON file
   */
  private loadTestData(): void {
    try {
      const rawData = fs.readFileSync(this.dataPath, 'utf8');
      this.testData = JSON.parse(rawData);
    } catch (error) {
      console.error('Failed to load test data:', error);
      throw new Error('Test data file not found or invalid JSON');
    }
  }

  /**
   * Reload test data (useful for dynamic updates)
   */
  public reloadTestData(): void {
    this.loadTestData();
  }

  // ===== USER DATA METHODS =====

  /**
   * Get valid user credentials
   */
  public getValidUser(username: string = 'demo'): UserCredentials {
    const user = this.testData.users.valid[username];
    if (!user) {
      throw new Error(`Valid user '${username}' not found in test data`);
    }
    return user;
  }

  /**
   * Get invalid user credentials for negative testing
   */
  public getInvalidUsers(): UserCredentials[] {
    return this.testData.users.invalid;
  }

  /**
   * Get specific invalid user by scenario
   */
  public getInvalidUser(scenario: 'invalidUsername' | 'invalidPassword' | 'emptyUsername' | 'emptyPassword' | 'emptyBoth'): UserCredentials {
    const invalidUsers = this.getInvalidUsers();

    switch (scenario) {
      case 'invalidUsername':
        return invalidUsers.find(u => u.username === 'invalid') || invalidUsers[0];
      case 'invalidPassword':
        return invalidUsers.find(u => u.username === 'demo' && u.password === 'wrongpass') || invalidUsers[1];
      case 'emptyUsername':
        return invalidUsers.find(u => u.username === '' && u.password === 'password') || invalidUsers[2];
      case 'emptyPassword':
        return invalidUsers.find(u => u.username === 'demo' && u.password === '') || invalidUsers[3];
      case 'emptyBoth':
        return invalidUsers.find(u => u.username === '' && u.password === '') || invalidUsers[4];
      default:
        return invalidUsers[0];
    }
  }

  // ===== PRODUCT DATA METHODS =====

  /**
   * Get products by language
   */
  public getProducts(language: 'japanese' | 'english' = 'japanese'): Product[] {
    return this.testData.products[language];
  }

  /**
   * Get specific product by name
   */
  public getProduct(productName: string, language: 'japanese' | 'english' = 'japanese'): Product | undefined {
    const products = this.getProducts(language);
    return products.find(p => p.name.includes(productName));
  }

  /**
   * Get products by category
   */
  public getProductsByCategory(category: string, language: 'japanese' | 'english' = 'japanese'): Product[] {
    const products = this.getProducts(language);
    return products.filter(p => p.category === category);
  }

  /**
   * Get category information
   */
  public getCategories() {
    return this.testData.products.categories;
  }

  /**
   * Get category names by language
   */
  public getCategoryNames(language: 'japanese' | 'english' = 'japanese'): string[] {
    const categories = this.getCategories();
    return Object.keys(categories);
  }

  // ===== SEARCH DATA METHODS =====

  /**
   * Get search terms by language
   */
  public getSearchTerms(language: 'japanese' | 'english' = 'japanese'): SearchTerm[] {
    return this.testData.searchTerms[language];
  }

  /**
   * Get specific search term
   */
  public getSearchTerm(term: string, language: 'japanese' | 'english' = 'japanese'): SearchTerm | undefined {
    const searchTerms = this.getSearchTerms(language);
    return searchTerms.find(s => s.term === term);
  }

  /**
   * Get search term with no results
   */
  public getNoResultsSearchTerm(language: 'japanese' | 'english' = 'japanese'): SearchTerm {
    const searchTerms = this.getSearchTerms(language);
    return searchTerms.find(s => s.resultCount === 0) || searchTerms[searchTerms.length - 1];
  }

  // ===== TODO DATA METHODS =====

  /**
   * Get sample todo items
   */
  public getTodoSamples(language?: 'japanese' | 'english'): TodoItem[] {
    const todos = this.testData.todos.samples;
    if (language) {
      return todos.filter((todo: TodoItem) => todo.language === language);
    }
    return todos;
  }

  /**
   * Get random todo item
   */
  public getRandomTodo(language: 'japanese' | 'english' = 'japanese'): TodoItem {
    const todos = this.getTodoSamples(language);
    return todos[Math.floor(Math.random() * todos.length)];
  }

  /**
   * Get todo validation data
   */
  public getTodoValidationData() {
    return this.testData.todos.validation;
  }

  /**
   * Generate unique todo text
   */
  public generateUniqueTodo(prefix: string = 'Test'): string {
    const timestamp = Date.now();
    return `${prefix} ${timestamp}`;
  }

  // ===== CART DATA METHODS =====

  /**
   * Get cart test scenarios
   */
  public getCartScenarios() {
    return this.testData.cart.testScenarios;
  }

  /**
   * Get specific cart scenario
   */
  public getCartScenario(scenarioName: string) {
    const scenarios = this.getCartScenarios();
    return scenarios.find((s: any) => s.name === scenarioName);
  }

  /**
   * Get invalid quantity values for testing
   */
  public getInvalidQuantities(): string[] {
    return this.testData.cart.invalidQuantities;
  }

  /**
   * Generate cart test data
   */
  public generateCartData(productNames: string[], quantities: number[]): CartItem[] {
    if (productNames.length !== quantities.length) {
      throw new Error('Product names and quantities arrays must have the same length');
    }

    return productNames.map((name, index) => ({
      productName: name,
      quantity: quantities[index]
    }));
  }

  // ===== LANGUAGE DATA METHODS =====

  /**
   * Get supported languages
   */
  public getSupportedLanguages(): string[] {
    return this.testData.languages.supported;
  }

  /**
   * Get default language
   */
  public getDefaultLanguage(): string {
    return this.testData.languages.default;
  }

  /**
   * Get translation for a key
   */
  public getTranslation(key: string, language: string): string {
    const translations = this.testData.languages.translations[key];
    if (!translations) {
      throw new Error(`Translation key '${key}' not found`);
    }
    return translations[language] || translations[this.getDefaultLanguage()];
  }

  /**
   * Get all translations for a language
   */
  public getAllTranslations(language: string): { [key: string]: string } {
    const translations = this.testData.languages.translations;
    const result: { [key: string]: string } = {};

    for (const [key, value] of Object.entries(translations)) {
      result[key] = (value as any)[language] || (value as any)[this.getDefaultLanguage()];
    }

    return result;
  }

  // ===== LOCALSTORAGE DATA METHODS =====

  /**
   * Get localStorage keys
   */
  public getLocalStorageKeys() {
    return this.testData.localStorage.keys;
  }

  /**
   * Get test localStorage data
   */
  public getTestLocalStorageData() {
    return this.testData.localStorage.testData;
  }

  /**
   * Generate localStorage test data
   */
  public generateLocalStorageData(overrides: { [key: string]: any } = {}): { [key: string]: string } {
    const baseData = this.getTestLocalStorageData();
    const mergedData = { ...baseData, ...overrides };

    // Convert objects to JSON strings (as localStorage stores strings)
    const result: { [key: string]: string } = {};
    for (const [key, value] of Object.entries(mergedData)) {
      result[key] = typeof value === 'string' ? value : JSON.stringify(value);
    }

    return result;
  }

  // ===== VALIDATION DATA METHODS =====

  /**
   * Get XSS payloads for security testing
   */
  public getXSSPayloads(): string[] {
    return this.testData.validation.xssPayloads;
  }

  /**
   * Get special characters for input testing
   */
  public getSpecialCharacters(): string[] {
    return this.testData.validation.specialCharacters;
  }

  /**
   * Get boundary values for testing
   */
  public getBoundaryValues() {
    return this.testData.validation.boundaryValues;
  }

  /**
   * Get invalid quantities for testing
   */
  public getInvalidQuantityValues(): (string | number)[] {
    return this.getBoundaryValues().quantities.invalid;
  }

  // ===== PERFORMANCE DATA METHODS =====

  /**
   * Get performance thresholds
   */
  public getPerformanceThresholds() {
    return this.testData.performance.thresholds;
  }

  /**
   * Get specific performance threshold
   */
  public getPerformanceThreshold(metric: string): number {
    const thresholds = this.getPerformanceThresholds();
    return thresholds[metric] || 5000; // Default 5 seconds
  }

  // ===== BROWSER DATA METHODS =====

  /**
   * Get supported browsers
   */
  public getSupportedBrowsers() {
    return this.testData.browsers.supported;
  }

  /**
   * Get mobile device configurations
   */
  public getMobileDevices() {
    return this.testData.browsers.mobile;
  }

  /**
   * Get browser configuration by name
   */
  public getBrowserConfig(browserName: string) {
    const browsers = this.getSupportedBrowsers();
    return browsers.find((b: any) => b.name === browserName);
  }

  // ===== UTILITY METHODS =====

  /**
   * Get random element from array
   */
  public getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Generate random string
   */
  public generateRandomString(length: number = 10): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  /**
   * Generate test email
   */
  public generateTestEmail(): string {
    return `test${this.generateRandomString(8)}@example.com`;
  }

  /**
   * Get current timestamp
   */
  public getCurrentTimestamp(): string {
    return new Date().toISOString();
  }

  /**
   * Get all test data (for debugging)
   */
  public getAllTestData(): any {
    return this.testData;
  }

  /**
   * Validate test data structure
   */
  public validateTestData(): boolean {
    const requiredSections = ['users', 'products', 'searchTerms', 'todos', 'cart', 'languages'];

    for (const section of requiredSections) {
      if (!this.testData[section]) {
        console.error(`Missing required test data section: ${section}`);
        return false;
      }
    }

    console.log('Test data validation passed');
    return true;
  }
}

// Export singleton instance
export const testDataManager = TestDataManager.getInstance();