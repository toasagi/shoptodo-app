import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { CustomWorld } from '../support/world';

// Given Steps
Given('the user is logged out', async function(this: CustomWorld) {
  await this.loginPage.goto();
  // Check if logged in and logout if necessary
  const logoutBtn = this.page.locator('#logout-btn');
  if (await logoutBtn.isVisible()) {
    await logoutBtn.click();
    await this.page.waitForTimeout(500);
  }
});

Given('the user has items in the cart', async function(this: CustomWorld) {
  // Add a product to cart
  const addToCartBtn = this.page.locator('.product-card .btn').first();
  await addToCartBtn.click();
  await this.page.waitForTimeout(500);
});

// When Steps
When('the user is on the home page', async function(this: CustomWorld) {
  await this.loginPage.goto();
  await this.page.waitForTimeout(500);
});

When('the user opens the login modal', async function(this: CustomWorld) {
  await this.page.locator('#login-btn').click();
  await this.page.waitForTimeout(500);
});

When('the user views the product catalog', async function(this: CustomWorld) {
  // Products should be visible on the main page
  await this.page.waitForSelector('.products-grid');
});

When('the user opens the checkout modal', async function(this: CustomWorld) {
  await this.page.locator('#checkout-btn').click();
  await this.page.waitForTimeout(500);
});

When('the user presses Tab key', async function(this: CustomWorld) {
  await this.page.keyboard.press('Tab');
  await this.page.waitForTimeout(200);
});

// Then Steps
Then('the page should have no critical accessibility violations', async function(this: CustomWorld) {
  const accessibilityScanResults = await new AxeBuilder({ page: this.page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();

  // Filter for critical and serious violations only
  const criticalViolations = accessibilityScanResults.violations.filter(
    v => v.impact === 'critical' || v.impact === 'serious'
  );

  if (criticalViolations.length > 0) {
    console.log('Accessibility violations found:');
    criticalViolations.forEach(v => {
      console.log(`- ${v.id}: ${v.description} (${v.impact})`);
      v.nodes.forEach(n => {
        console.log(`  Target: ${n.target}`);
      });
    });
  }

  expect(criticalViolations.length,
    `Found ${criticalViolations.length} critical/serious accessibility violations`
  ).toBe(0);
});

Then('the modal should have no critical accessibility violations', async function(this: CustomWorld) {
  // Run axe on the modal content
  const accessibilityScanResults = await new AxeBuilder({ page: this.page })
    .include('.modal[style*="block"]')
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();

  const criticalViolations = accessibilityScanResults.violations.filter(
    v => v.impact === 'critical' || v.impact === 'serious'
  );

  if (criticalViolations.length > 0) {
    console.log('Modal accessibility violations found:');
    criticalViolations.forEach(v => {
      console.log(`- ${v.id}: ${v.description} (${v.impact})`);
    });
  }

  expect(criticalViolations.length,
    `Found ${criticalViolations.length} critical/serious modal accessibility violations`
  ).toBe(0);
});

Then('the modal should have proper ARIA attributes', async function(this: CustomWorld) {
  const modal = this.page.locator('.modal[style*="block"]');

  // Check role="dialog"
  const role = await modal.getAttribute('role');
  expect(role, 'Modal should have role="dialog"').toBe('dialog');

  // Check aria-modal="true"
  const ariaModal = await modal.getAttribute('aria-modal');
  expect(ariaModal, 'Modal should have aria-modal="true"').toBe('true');

  // Check aria-labelledby exists
  const ariaLabelledby = await modal.getAttribute('aria-labelledby');
  expect(ariaLabelledby, 'Modal should have aria-labelledby').toBeTruthy();
});

Then('the product list should have no critical accessibility violations', async function(this: CustomWorld) {
  const accessibilityScanResults = await new AxeBuilder({ page: this.page })
    .include('.products-grid')
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();

  const criticalViolations = accessibilityScanResults.violations.filter(
    v => v.impact === 'critical' || v.impact === 'serious'
  );

  expect(criticalViolations.length,
    `Found ${criticalViolations.length} critical/serious product list accessibility violations`
  ).toBe(0);
});

Then('the checkout form should have proper labels', async function(this: CustomWorld) {
  // Check that all form inputs have associated labels
  const inputs = this.page.locator('#checkout-modal input:not([type="hidden"]), #checkout-modal select');
  const count = await inputs.count();

  for (let i = 0; i < count; i++) {
    const input = inputs.nth(i);
    const id = await input.getAttribute('id');

    if (id) {
      // Check for associated label
      const label = this.page.locator(`label[for="${id}"]`);
      const labelExists = await label.count() > 0;
      expect(labelExists, `Input #${id} should have an associated label`).toBe(true);
    }
  }
});

Then('the skip link should be visible', async function(this: CustomWorld) {
  const skipLink = this.page.locator('.skip-link');

  // The skip link should be visible when focused
  await expect(skipLink).toBeFocused();

  // Check that it's visually visible (top should be 0 when focused)
  const boundingBox = await skipLink.boundingBox();
  expect(boundingBox, 'Skip link should be visible').toBeTruthy();
  expect(boundingBox!.y, 'Skip link should be at top of page').toBeGreaterThanOrEqual(0);
});

Then('the skip link should navigate to main content', async function(this: CustomWorld) {
  const skipLink = this.page.locator('.skip-link');
  await skipLink.click();
  await this.page.waitForTimeout(200);

  // Check that focus moved to main content area or the URL hash changed
  const url = this.page.url();
  expect(url, 'URL should contain #main-content').toContain('#main-content');
});
