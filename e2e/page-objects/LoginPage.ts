import { Page, Locator } from '@playwright/test';

export class LoginPage {
  private page: Page;
  private appUrl: string;

  // Locators
  private loginModal: Locator;
  private usernameInput: Locator;
  private passwordInput: Locator;
  private loginButton: Locator;
  private errorMessage: Locator;

  constructor(page: Page, appUrl: string) {
    this.page = page;
    this.appUrl = appUrl;

    // Initialize locators based on actual application selectors
    this.loginModal = this.page.locator('#login-modal');
    this.usernameInput = this.page.locator('#username-input');
    this.passwordInput = this.page.locator('#password-input');
    this.loginButton = this.page.locator('#login-form button[type="submit"]');
    // Error messages are displayed as floating messages with class .message.message-error
    this.errorMessage = this.page.locator('.message.message-error');
  }

  /**
   * Navigate to the login page
   */
  async goto(): Promise<void> {
    await this.page.goto(this.appUrl);
    await this.waitForPageLoad();
  }

  /**
   * Wait for the page to load
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    // Wait for the page to be ready, but don't require login modal immediately
    try {
      await this.page.waitForSelector('body', { state: 'attached', timeout: 5000 });
    } catch (error) {
      console.warn('Page body not found, continuing anyway');
    }
  }

  /**
   * Check if login modal is displayed
   */
  async isLoginModalDisplayed(): Promise<boolean> {
    try {
      await this.loginModal.waitFor({ state: 'visible', timeout: 5000 });
      return await this.loginModal.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Enter username
   */
  async enterUsername(username: string): Promise<void> {
    await this.usernameInput.waitFor({ state: 'visible' });
    await this.usernameInput.clear();
    await this.usernameInput.fill(username);
  }

  /**
   * Enter password
   */
  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.waitFor({ state: 'visible' });
    await this.passwordInput.clear();
    await this.passwordInput.fill(password);
  }

  /**
   * Click login button
   */
  async clickLoginButton(): Promise<void> {
    await this.loginButton.waitFor({ state: 'visible' });
    await this.loginButton.click();
  }

  /**
   * Perform complete login with credentials
   */
  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }

  /**
   * Check if error message is displayed
   */
  async isErrorMessageDisplayed(): Promise<boolean> {
    try {
      // Wait a bit for the error message to appear after form submission
      await this.page.waitForTimeout(500);

      // Check if error message element exists and is visible
      const errorCount = await this.errorMessage.count();
      if (errorCount > 0) {
        return await this.errorMessage.first().isVisible();
      }
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    try {
      const errorCount = await this.errorMessage.count();
      if (errorCount > 0) {
        const text = await this.errorMessage.first().textContent();
        return text || '';
      }
    } catch (error) {
      console.warn('Could not get error message:', error);
    }
    return '';
  }

  /**
   * Check for validation errors (empty fields, etc.)
   */
  async hasValidationError(): Promise<boolean> {
    // Check for HTML5 validation or custom validation messages
    const usernameValid = await this.usernameInput.evaluate(el => (el as HTMLInputElement).validity.valid);
    const passwordValid = await this.passwordInput.evaluate(el => (el as HTMLInputElement).validity.valid);

    return !usernameValid || !passwordValid || await this.isErrorMessageDisplayed();
  }
}