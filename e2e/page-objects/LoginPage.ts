import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Login Page Object
 * Maps to: TC-AUTH-001 to TC-AUTH-009
 * Requirements: REQ-F-001 (User Authentication)
 * User Stories: US-001, US-002, US-003
 */
export class LoginPage extends BasePage {
  // Page Elements
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  private readonly loginModal: Locator;
  private readonly loginModalTitle: Locator;

  constructor(page: Page) {
    super(page, '/');

    // Initialize locators
    this.usernameInput = this.page.locator('#username');
    this.passwordInput = this.page.locator('#password');
    this.loginButton = this.page.locator('#loginBtn');
    this.errorMessage = this.page.locator('#errorMessage');
    this.loginModal = this.page.locator('#loginModal');
    this.loginModalTitle = this.page.locator('#loginModal h2');
  }

  /**
   * TC-AUTH-001: Valid login credentials
   * Enter username in the username field
   */
  async enterUsername(username: string): Promise<void> {
    await this.fillInput(this.usernameInput, username);
  }

  /**
   * TC-AUTH-001: Valid login credentials
   * Enter password in the password field
   */
  async enterPassword(password: string): Promise<void> {
    await this.fillInput(this.passwordInput, password);
  }

  /**
   * TC-AUTH-001 to TC-AUTH-006: All login test cases
   * Click the login button
   */
  async clickLoginButton(): Promise<void> {
    await this.clickElement(this.loginButton);
  }

  /**
   * TC-AUTH-001: Valid login credentials
   * Complete login process with valid credentials
   */
  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }

  /**
   * TC-AUTH-001: Valid login credentials
   * Login with demo credentials
   */
  async loginWithDemoCredentials(): Promise<void> {
    await this.login('demo', 'password');
  }

  /**
   * TC-AUTH-002, TC-AUTH-003: Invalid credentials
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    await this.waitForElementVisible(this.errorMessage);
    return await this.getElementText(this.errorMessage);
  }

  /**
   * TC-AUTH-002, TC-AUTH-003: Invalid credentials
   * Check if error message is displayed
   */
  async isErrorMessageDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.errorMessage);
  }

  /**
   * TC-AUTH-004, TC-AUTH-005, TC-AUTH-006: Empty field validation
   * Check if error message contains specific text
   */
  async isErrorMessageContainsText(expectedText: string): Promise<boolean> {
    return await this.elementContainsText(this.errorMessage, expectedText);
  }

  /**
   * Check if login modal is displayed
   */
  async isLoginModalDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.loginModal);
  }

  /**
   * Get login modal title
   */
  async getLoginModalTitle(): Promise<string> {
    return await this.getElementText(this.loginModalTitle);
  }

  /**
   * Check if username field is empty
   */
  async isUsernameFieldEmpty(): Promise<boolean> {
    const value = await this.usernameInput.inputValue();
    return value === '';
  }

  /**
   * Check if password field is empty
   */
  async isPasswordFieldEmpty(): Promise<boolean> {
    const value = await this.passwordInput.inputValue();
    return value === '';
  }

  /**
   * Clear username field
   */
  async clearUsernameField(): Promise<void> {
    await this.usernameInput.clear();
  }

  /**
   * Clear password field
   */
  async clearPasswordField(): Promise<void> {
    await this.passwordInput.clear();
  }

  /**
   * TC-AUTH-008: Session persistence
   * Check if user is already logged in (no login modal visible)
   */
  async isUserAlreadyLoggedIn(): Promise<boolean> {
    // Wait a bit for page to load completely
    await this.page.waitForTimeout(1000);
    return !(await this.isLoginModalDisplayed());
  }

  /**
   * Validation methods for test assertions
   */

  /**
   * TC-AUTH-001: Assert successful login
   */
  async assertSuccessfulLogin(): Promise<void> {
    // Login modal should disappear after successful login
    await this.waitForElementHidden(this.loginModal, 5000);

    // Page should navigate to dashboard
    await this.assertPageUrl('http://localhost:8000/', 'Should navigate to dashboard after login');
  }

  /**
   * TC-AUTH-002, TC-AUTH-003: Assert login failure
   */
  async assertLoginFailure(expectedErrorMessage: string): Promise<void> {
    await this.assertElementVisible(this.errorMessage, 'Error message should be visible');
    await this.assertElementContainsText(this.errorMessage, expectedErrorMessage,
      `Error message should contain: ${expectedErrorMessage}`);

    // Should stay on login page
    await this.assertElementVisible(this.loginModal, 'Login modal should still be visible');
  }

  /**
   * TC-AUTH-004, TC-AUTH-005, TC-AUTH-006: Assert validation error
   */
  async assertValidationError(expectedErrorMessage: string): Promise<void> {
    await this.assertElementVisible(this.errorMessage, 'Validation error should be visible');
    await this.assertElementContainsText(this.errorMessage, expectedErrorMessage,
      `Validation error should contain: ${expectedErrorMessage}`);
  }

  /**
   * TC-AUTH-008, TC-AUTH-009: Assert login state persistence
   */
  async assertLoginStatePersistence(): Promise<void> {
    const isLoggedIn = await this.isUserAlreadyLoggedIn();
    if (!isLoggedIn) {
      throw new Error('Login state should be persisted after page reload');
    }
  }

  /**
   * Check localStorage for login information
   */
  async getLoginStateFromStorage(): Promise<any> {
    const loginState = await this.getLocalStorageItem('loginState');
    return loginState ? JSON.parse(loginState) : null;
  }

  /**
   * TC-AUTH-008, TC-AUTH-009: Assert localStorage contains login info
   */
  async assertLoginInfoInLocalStorage(): Promise<void> {
    const loginState = await this.getLoginStateFromStorage();
    if (!loginState || !loginState.isLoggedIn || loginState.username !== 'demo') {
      throw new Error('Login information should be saved in localStorage');
    }
  }
}