import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

Then('the navigation should show {string} link', async function (this: CustomWorld, linkText: string) {
  const navMenu = this.page.locator('.nav-menu');
  const link = navMenu.locator(`text=${linkText}`);
  await expect(link).toBeVisible();
});

Then('the navigation should not show {string} link', async function (this: CustomWorld, linkText: string) {
  const navMenu = this.page.locator('.nav-menu');
  const link = navMenu.locator(`text=${linkText}`);
  await expect(link).not.toBeVisible();
});

When('the user clicks the {string} navigation link', async function (this: CustomWorld, linkText: string) {
  const navMenu = this.page.locator('.nav-menu');
  const link = navMenu.locator(`text=${linkText}`);
  await link.click();
});

Then('the catalog section should be visible', async function (this: CustomWorld) {
  const catalogSection = this.page.locator('#catalog-section');
  await expect(catalogSection).toBeVisible();
  // Check if it's scrolled into view
  await expect(catalogSection).toBeInViewport();
});

Then('the order history modal should be visible', async function (this: CustomWorld) {
  const modal = this.page.locator('#order-history-modal');
  await expect(modal).toBeVisible();
});
