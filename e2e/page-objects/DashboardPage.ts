import { Page, Locator } from '@playwright/test';

export class DashboardPage {
  private page: Page;
  private appUrl: string;

  // Locators
  private userDisplay: Locator;
  private logoutButton: Locator;
  private productSection: Locator;
  private todoSection: Locator;
  private cartSection: Locator;

  constructor(page: Page, appUrl: string) {
    this.page = page;
    this.appUrl = appUrl;

    // Initialize locators based on actual application selectors
    this.userDisplay = this.page.locator('#username');
    this.logoutButton = this.page.locator('#logout-btn');
    this.productSection = this.page.locator('.product-grid');
    this.todoSection = this.page.locator('.todo-section');
    this.cartSection = this.page.locator('.cart-section');
  }

  /**
   * Navigate to the dashboard
   */
  async goto(): Promise<void> {
    await this.page.goto(this.appUrl);
    await this.waitForPageLoad();
  }

  /**
   * Wait for the dashboard to load
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');

    // Wait for key dashboard elements to be visible
    try {
      await this.page.waitForSelector('#username, .product-grid', {
        state: 'visible',
        timeout: 10000
      });
    } catch {
      // If dashboard elements aren't visible, user might not be logged in
    }
  }

  /**
   * Check if dashboard is loaded (user is logged in)
   */
  async isDashboardLoaded(): Promise<boolean> {
    try {
      // Check if user display is visible (indicating successful login)
      const isUserDisplayVisible = await this.userDisplay.isVisible();

      // Also check if key dashboard sections are present
      const isProductSectionVisible = await this.productSection.isVisible();

      return isUserDisplayVisible || isProductSectionVisible;
    } catch {
      return false;
    }
  }

  /**
   * Get displayed username
   */
  async getDisplayedUsername(): Promise<string> {
    try {
      await this.userDisplay.waitFor({ state: 'visible', timeout: 5000 });
      const userText = await this.userDisplay.textContent() || '';

      // Extract username from text like "ユーザー: demo" or "User: demo"
      const match = userText.match(/(?:ユーザー|User):\s*(.+)/);
      return match ? match[1].trim() : userText.trim();
    } catch {
      return '';
    }
  }

  /**
   * Click logout button
   */
  async clickLogoutButton(): Promise<void> {
    await this.logoutButton.waitFor({ state: 'visible' });
    await this.logoutButton.click();
  }

  /**
   * Check if logout button is visible (indicates user is logged in)
   */
  async isLogoutButtonVisible(): Promise<boolean> {
    try {
      return await this.logoutButton.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Get current page URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Wait for an element to be visible
   */
  async waitForElementVisible(locator: Locator, timeout: number = 5000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }
}