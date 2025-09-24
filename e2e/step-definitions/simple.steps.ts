import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

When('the user navigates to the application', async function(this: CustomWorld) {
  await this.page.goto(this.config.appUrl);
  await this.page.waitForLoadState('networkidle');
});

Then('the page should load successfully', async function(this: CustomWorld) {
  const pageTitle = await this.page.title();
  console.log('Page Title:', pageTitle);
  console.log('Page URL:', this.page.url());

  // Basic check that page loaded
  expect(pageTitle, 'Page should have a title').toBeTruthy();

  // Check if we can find basic HTML elements
  const bodyExists = await this.page.locator('body').isVisible();
  expect(bodyExists, 'Page body should be visible').toBe(true);
});