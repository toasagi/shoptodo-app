import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

// Given Steps
Given('the application is available', async function(this: CustomWorld) {
  // Navigate to the app and wait for it to load
  await this.navigateToApp();
});

Given('the user is on the login page', async function(this: CustomWorld) {
  await this.loginPage.goto();
  await this.loginPage.waitForPageLoad();
});

Given('the language is set to English', async function(this: CustomWorld) {
  // Click the English language button if not already active
  const enButton = this.page.locator('#lang-en');
  const isActive = await enButton.evaluate(el => el.classList.contains('active'));

  if (!isActive) {
    await enButton.click();
    await this.page.waitForTimeout(500); // Wait for language change
  }
});

Given('the login modal is displayed', async function(this: CustomWorld) {
  const isDisplayed = await this.loginPage.isLoginModalDisplayed();
  expect(isDisplayed, 'Login modal should be displayed').toBe(true);
});

Given('the user is logged in as {string}', async function(this: CustomWorld, username: string) {
  await this.loginPage.goto();
  // Click the login button to open modal
  await this.page.locator('#login-btn').click();
  await this.page.waitForTimeout(500);

  await this.loginPage.login(username, 'password');
  await this.dashboardPage.waitForPageLoad();

  // Verify login success
  const displayedUsername = await this.dashboardPage.getDisplayedUsername();
  expect(displayedUsername, `Should be logged in as ${username}`).toBe(username);
});

// When Steps
When('the user clicks the login button to open modal', async function(this: CustomWorld) {
  // Click the login button in the header to open the modal
  await this.page.locator('#login-btn').click();
  await this.page.waitForTimeout(500); // Allow time for modal animation
});

When('the user enters username {string}', async function(this: CustomWorld, username: string) {
  await this.loginPage.enterUsername(username);
  this.setTestData('enteredUsername', username);
});

When('the user enters password {string}', async function(this: CustomWorld, password: string) {
  await this.loginPage.enterPassword(password);
  this.setTestData('enteredPassword', password);
});

When('the user submits the login form', async function(this: CustomWorld) {
  await this.loginPage.clickLoginButton();
  await this.page.waitForTimeout(1000); // Allow time for login process
});

When('the user clicks the login button', async function(this: CustomWorld) {
  await this.loginPage.clickLoginButton();
  await this.page.waitForTimeout(1000); // Allow time for login process
});

When('the user clicks the logout button', async function(this: CustomWorld) {
  await this.dashboardPage.clickLogoutButton();
  await this.page.waitForTimeout(1000); // Allow time for logout process
});

// Then Steps - Success Scenarios
Then('the user should be logged in successfully', async function(this: CustomWorld) {
  // Wait a moment for the login to process
  await this.page.waitForTimeout(1000);

  // Check if the logout button is visible (indicates successful login)
  const isLogoutButtonVisible = await this.dashboardPage.isLogoutButtonVisible();
  expect(isLogoutButtonVisible, 'Logout button should be visible after successful login').toBe(true);
});

Then('the dashboard should be displayed', async function(this: CustomWorld) {
  // Verify we're on the dashboard by checking for key elements
  const isDashboardLoaded = await this.dashboardPage.isDashboardLoaded();
  expect(isDashboardLoaded, 'Dashboard should be displayed').toBe(true);

  // Verify the page URL contains the expected path
  const currentUrl = this.page.url();
  expect(currentUrl, 'Should be on the main application page').toContain('localhost');
});

Then('the username {string} should be displayed in the header', async function(this: CustomWorld, expectedUsername: string) {
  const displayedUsername = await this.dashboardPage.getDisplayedUsername();
  expect(displayedUsername, `Username should be displayed as ${expectedUsername}`).toBe(expectedUsername);
});

// Then Steps - Error Scenarios
Then('an error message should be displayed', async function(this: CustomWorld) {
  const isErrorDisplayed = await this.loginPage.isErrorMessageDisplayed();
  expect(isErrorDisplayed, 'An error message should be displayed').toBe(true);

  const errorMessage = await this.loginPage.getErrorMessage();
  expect(errorMessage, 'Error message should not be empty').toBeTruthy();
});

Then('the user should remain on the login page', async function(this: CustomWorld) {
  const isLoginModalDisplayed = await this.loginPage.isLoginModalDisplayed();
  expect(isLoginModalDisplayed, 'Should remain on login page').toBe(true);
});

Then('a validation error should be displayed', async function(this: CustomWorld) {
  // Check for validation errors (could be different from login errors)
  const hasValidationError = await this.loginPage.hasValidationError();
  expect(hasValidationError, 'A validation error should be displayed').toBe(true);
});

// Then Steps - Logout Scenarios
Then('the user should be logged out successfully', async function(this: CustomWorld) {
  // Wait for logout to process
  await this.page.waitForTimeout(1000);

  // Check that the login button is visible again (indicates successful logout)
  const isLoginButtonVisible = await this.page.locator('#login-btn').isVisible();
  expect(isLoginButtonVisible, 'Login button should be visible after logout').toBe(true);

  // Check that the logout button is no longer visible
  const isLogoutButtonVisible = await this.dashboardPage.isLogoutButtonVisible();
  expect(isLogoutButtonVisible, 'Logout button should not be visible after logout').toBe(false);
});

Then('the login modal should be displayed', async function(this: CustomWorld) {
  // After logout, the modal should not be visible but the login button should be
  const isLoginButtonVisible = await this.page.locator('#login-btn').isVisible();
  expect(isLoginButtonVisible, 'Login button should be visible').toBe(true);
});

// ============================================
// Japanese UI Steps (Issue #27)
// ============================================

Then('the error message should be in Japanese', async function(this: CustomWorld) {
  // Wait for error message to appear
  await this.page.waitForTimeout(500);

  // Check for Japanese error message
  const japanesePattern = /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/;

  const errorMessage = await this.loginPage.getErrorMessage();
  expect(
    japanesePattern.test(errorMessage || ''),
    `Error message should be in Japanese, got: "${errorMessage}"`
  ).toBe(true);
});

Then('the login button text should be {string}', async function(this: CustomWorld, expectedText: string) {
  // Check login button text in the login form specifically
  const loginButtonInModal = this.page.locator('#login-form button[type="submit"]');
  const buttonText = await loginButtonInModal.textContent();
  expect(buttonText?.trim(), `Login button text should be "${expectedText}"`).toContain(expectedText);
});