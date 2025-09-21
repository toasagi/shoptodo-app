import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

/**
 * Authentication Step Definitions
 * Maps to authentication.feature scenarios
 * Test Cases: TC-AUTH-001 to TC-AUTH-009
 * Requirements: REQ-F-001 (User Authentication)
 */

// Given Steps
Given('the user is on the login page', async function(this: CustomWorld) {
  await this.pageObjects.loginPage.goto();
  await this.pageObjects.loginPage.waitForPageLoad();
});

Given('the application is in initial state', async function(this: CustomWorld) {
  await this.clearApplicationState();
  await this.pageObjects.loginPage.reload();
});

Given('the login modal is displayed', async function(this: CustomWorld) {
  const isDisplayed = await this.pageObjects.loginPage.isLoginModalDisplayed();
  expect(isDisplayed, 'Login modal should be displayed').toBe(true);
});

Given('the user is logged in as {string}', async function(this: CustomWorld, username: string) {
  await this.pageObjects.loginPage.login(username, 'password');
  await this.pageObjects.dashboardPage.waitForPageLoad();

  // Verify login success
  const displayedUsername = await this.pageObjects.dashboardPage.getDisplayedUsername();
  expect(displayedUsername).toBe(username);

  // Store login state for later verification
  this.setTestData('loggedInUser', username);
});

Given('the user is on the dashboard page', async function(this: CustomWorld) {
  // Ensure we're on dashboard - if not, navigate there
  const currentUrl = await this.pageObjects.dashboardPage.getCurrentUrl();
  if (!currentUrl.includes('localhost:8000')) {
    await this.pageObjects.dashboardPage.goto();
  }
  await this.pageObjects.dashboardPage.waitForPageLoad();
});

// When Steps
When('the user enters username {string}', async function(this: CustomWorld, username: string) {
  await this.pageObjects.loginPage.enterUsername(username);
  this.setTestData('enteredUsername', username);
});

When('the user enters password {string}', async function(this: CustomWorld, password: string) {
  await this.pageObjects.loginPage.enterPassword(password);
  this.setTestData('enteredPassword', password);
});

When('the user clicks the login button', async function(this: CustomWorld) {
  await this.pageObjects.loginPage.clickLoginButton();

  // Wait a moment for the login process to complete
  await this.page.waitForTimeout(1000);
});

When('the user clicks the logout button', async function(this: CustomWorld) {
  await this.pageObjects.dashboardPage.clickLogoutButton();
  await this.page.waitForTimeout(1000);
});

When('the user reloads the page', async function(this: CustomWorld) {
  await this.pageObjects.loginPage.reload();
  await this.page.waitForTimeout(1000);
});

When('the browser is restarted', async function(this: CustomWorld) {
  // Store current localStorage state
  const currentState = await this.getLocalStorageState();
  this.setTestData('preRestartLocalStorage', currentState);

  // Simulate browser restart
  await this.simulateBrowserRestart();
});

When('the user navigates to the application URL', async function(this: CustomWorld) {
  await this.navigateToApp();
});

// Then Steps - Success Scenarios
Then('the user should be logged in successfully', async function(this: CustomWorld) {
  await this.pageObjects.loginPage.assertSuccessfulLogin();
});

Then('the dashboard page should be displayed', async function(this: CustomWorld) {
  await this.pageObjects.dashboardPage.waitForPageLoad();
  const currentUrl = this.page.url();
  expect(currentUrl).toContain('localhost:8000');
});

Then('the username {string} should be displayed in the header', async function(this: CustomWorld, expectedUsername: string) {
  await this.pageObjects.dashboardPage.waitForElementVisible(
    this.page.locator('#userDisplay'), 5000
  );

  const displayedUsername = await this.pageObjects.dashboardPage.getDisplayedUsername();
  expect(displayedUsername, `Username should be ${expectedUsername}`).toBe(expectedUsername);
});

Then('the login state should be saved in localStorage', async function(this: CustomWorld) {
  await this.pageObjects.loginPage.assertLoginInfoInLocalStorage();
});

Then('the user should be logged out successfully', async function(this: CustomWorld) {
  // Should navigate back to login page and show login modal
  const isLoginModalDisplayed = await this.pageObjects.loginPage.isLoginModalDisplayed();
  expect(isLoginModalDisplayed, 'Login modal should be displayed after logout').toBe(true);
});

Then('the login page should be displayed', async function(this: CustomWorld) {
  const isLoginModalDisplayed = await this.pageObjects.loginPage.isLoginModalDisplayed();
  expect(isLoginModalDisplayed, 'Login page/modal should be displayed').toBe(true);
});

Then('the login information should be removed from localStorage', async function(this: CustomWorld) {
  const loginState = await this.pageObjects.loginPage.getLoginStateFromStorage();
  expect(loginState?.isLoggedIn, 'Login state should be false or null').toBeFalsy();
});

Then('the username should not be displayed in the header', async function(this: CustomWorld) {
  // Check if user display element is hidden or shows default text
  const isLogoutButtonVisible = await this.pageObjects.dashboardPage.isLogoutButtonVisible();
  expect(isLogoutButtonVisible, 'Logout button should not be visible').toBe(false);
});

Then('the login state should be maintained', async function(this: CustomWorld) {
  await this.pageObjects.loginPage.assertLoginStatePersistence();
});

Then('the login state should be restored', async function(this: CustomWorld) {
  // Verify that user is automatically logged in without showing login modal
  const isUserLoggedIn = await this.pageObjects.loginPage.isUserAlreadyLoggedIn();
  expect(isUserLoggedIn, 'User should be automatically logged in after browser restart').toBe(true);
});

// Then Steps - Error Scenarios
Then('an error message {string} should be displayed', async function(this: CustomWorld, expectedErrorMessage: string) {
  await this.pageObjects.loginPage.assertLoginFailure(expectedErrorMessage);
});

Then('the user should remain on the login page', async function(this: CustomWorld) {
  const isLoginModalDisplayed = await this.pageObjects.loginPage.isLoginModalDisplayed();
  expect(isLoginModalDisplayed, 'Should remain on login page').toBe(true);
});

Then('no login information should be saved in localStorage', async function(this: CustomWorld) {
  const loginState = await this.pageObjects.loginPage.getLoginStateFromStorage();
  expect(loginState?.isLoggedIn, 'No login info should be saved').toBeFalsy();
});

Then('a validation error {string} should be displayed', async function(this: CustomWorld, expectedErrorMessage: string) {
  await this.pageObjects.loginPage.assertValidationError(expectedErrorMessage);
});

Then('the login process should not execute', async function(this: CustomWorld) {
  // Verify we're still on login page and no login state exists
  const isLoginModalDisplayed = await this.pageObjects.loginPage.isLoginModalDisplayed();
  expect(isLoginModalDisplayed, 'Login modal should still be displayed').toBe(true);

  const loginState = await this.pageObjects.loginPage.getLoginStateFromStorage();
  expect(loginState?.isLoggedIn, 'Login process should not have executed').toBeFalsy();
});

// Security-related steps
Then('the script should not be executed', async function(this: CustomWorld) {
  // Listen for any alert dialogs (which would indicate script execution)
  let alertFired = false;

  this.page.on('dialog', async (dialog) => {
    alertFired = true;
    await dialog.dismiss();
  });

  // Wait a moment to see if any script executes
  await this.page.waitForTimeout(2000);

  expect(alertFired, 'No script should be executed (no alert should appear)').toBe(false);
});

Then('an appropriate error message should be displayed', async function(this: CustomWorld) {
  const isErrorDisplayed = await this.pageObjects.loginPage.isErrorMessageDisplayed();
  expect(isErrorDisplayed, 'An error message should be displayed for security attempt').toBe(true);
});

Then('the application should remain secure', async function(this: CustomWorld) {
  // Check that login modal is still displayed and no unauthorized access occurred
  const isLoginModalDisplayed = await this.pageObjects.loginPage.isLoginModalDisplayed();
  expect(isLoginModalDisplayed, 'Login modal should still be displayed').toBe(true);

  // Verify no login state was created
  const loginState = await this.pageObjects.loginPage.getLoginStateFromStorage();
  expect(loginState?.isLoggedIn, 'No unauthorized login should occur').toBeFalsy();
});

// Helper steps for complex scenarios
Then('the authentication state should be consistent', async function(this: CustomWorld) {
  const loggedInUser = this.getTestData('loggedInUser');

  if (loggedInUser) {
    // If user should be logged in, verify all indicators
    const displayedUsername = await this.pageObjects.dashboardPage.getDisplayedUsername();
    expect(displayedUsername).toBe(loggedInUser);

    const isLogoutButtonVisible = await this.pageObjects.dashboardPage.isLogoutButtonVisible();
    expect(isLogoutButtonVisible, 'Logout button should be visible when logged in').toBe(true);

    await this.pageObjects.loginPage.assertLoginInfoInLocalStorage();
  } else {
    // If user should not be logged in, verify login modal is shown
    const isLoginModalDisplayed = await this.pageObjects.loginPage.isLoginModalDisplayed();
    expect(isLoginModalDisplayed, 'Login modal should be displayed when not logged in').toBe(true);
  }
});