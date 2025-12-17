import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

// When Steps - Checkout Modal
When('the user closes the checkout modal', async function(this: CustomWorld) {
  // Click the OK button on the order complete screen or the close button
  const okButton = this.page.locator('#close-checkout');
  if (await okButton.isVisible()) {
    await okButton.click();
  } else {
    const closeButton = this.page.locator('#checkout-close');
    await closeButton.click();
  }
  await this.page.waitForTimeout(500);
});

// Then Steps - Order History
Then('the recent order should be displayed', async function(this: CustomWorld) {
  const orderItems = await this.page.locator('.order-history-item').count();
  expect(orderItems, 'At least one order should be displayed in history').toBeGreaterThan(0);
});

Then('there should be at least {int} orders in history', async function(this: CustomWorld, count: number) {
  const orderItems = await this.page.locator('.order-history-item').count();
  expect(orderItems, `At least ${count} orders should be in history`).toBeGreaterThanOrEqual(count);
});

// Then Steps - Order Summary
Then('the order summary should show {int} items', async function(this: CustomWorld, count: number) {
  const orderItems = await this.page.locator('#order-items-list .order-item-line').count();
  expect(orderItems, `Order summary should show ${count} items`).toBe(count);
});

// Helper step for filling valid shipping info (used by multiple scenarios)
When('the user fills in valid shipping information', async function(this: CustomWorld) {
  await this.page.fill('#shipping-name', 'Test User');
  await this.page.fill('#shipping-email', 'test@example.com');
  await this.page.fill('#shipping-phone', '090-1234-5678');
  await this.page.fill('#shipping-postal', '100-0001');
  await this.page.fill('#shipping-address', 'Tokyo, Test Address 1-1');
});
