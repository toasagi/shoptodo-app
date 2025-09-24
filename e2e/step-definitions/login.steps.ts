import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

// Given Steps
Given('the application is available', async function(this: CustomWorld) {
  // This step will be verified when we navigate to the app
});

Given('the user is on the login page', async function(this: CustomWorld) {
  await this.loginPage.goto();
  await this.loginPage.waitForPageLoad();
});

Given('the login modal is displayed', async function(this: CustomWorld) {
  const isDisplayed = await this.loginPage.isLoginModalDisplayed();
  expect(isDisplayed, 'Login modal should be displayed').toBe(true);
});

Given('the user is logged in as {string}', async function(this: CustomWorld, username: string) {
  await this.loginPage.goto();
  await this.loginPage.login(username, 'password');
  await this.dashboardPage.waitForPageLoad();

  // Verify login success
  const displayedUsername = await this.dashboardPage.getDisplayedUsername();
  expect(displayedUsername, `Should be logged in as ${username}`).toBe(username);
});

// When Steps
When('the user enters username {string}', async function(this: CustomWorld, username: string) {
  await this.loginPage.enterUsername(username);
  this.setTestData('enteredUsername', username);
});

When('the user enters password {string}', async function(this: CustomWorld, password: string) {
  await this.loginPage.enterPassword(password);
  this.setTestData('enteredPassword', password);
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
  // Wait for dashboard to load and verify login success
  await this.dashboardPage.waitForPageLoad();

  // Check if login modal is no longer displayed
  const isLoginModalDisplayed = await this.loginPage.isLoginModalDisplayed();
  expect(isLoginModalDisplayed, 'Login modal should be hidden after successful login').toBe(false);
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
  // Check that login modal is displayed again
  const isLoginModalDisplayed = await this.loginPage.isLoginModalDisplayed();
  expect(isLoginModalDisplayed, 'Login modal should be displayed after logout').toBe(true);
});

Then('the login modal should be displayed', async function(this: CustomWorld) {
  const isLoginModalDisplayed = await this.loginPage.isLoginModalDisplayed();
  expect(isLoginModalDisplayed, 'Login modal should be displayed').toBe(true);
});