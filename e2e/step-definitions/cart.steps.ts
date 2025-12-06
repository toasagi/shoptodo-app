import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

// Helper function to add product to cart
async function addProductToCartByName(world: CustomWorld, productName: string): Promise<void> {
  const products = await world.page.locator('.product-card').all();
  for (const product of products) {
    const name = await product.locator('.product-name').textContent();
    if (name?.includes(productName)) {
      // Click the "Add to Cart" button inside the product card
      await product.locator('button.btn-primary').click();
      await world.page.waitForTimeout(500);
      break;
    }
  }
}

// Given Steps
Given('the user has {string} in the cart', async function(this: CustomWorld, productName: string) {
  await addProductToCartByName(this, productName);

  // Verify product was added by checking cart items
  await this.page.waitForTimeout(500);
  const cartItemCount = await this.page.locator('.cart-item').count();
  expect(cartItemCount, `${productName} should be in cart`).toBeGreaterThan(0);
});

// When Steps
When('the user adds {string} to the cart', async function(this: CustomWorld, productName: string) {
  await addProductToCartByName(this, productName);
});

When('the user adds {string} to the cart again', async function(this: CustomWorld, productName: string) {
  await addProductToCartByName(this, productName);
});

When('the user removes {string} from the cart', async function(this: CustomWorld, productName: string) {
  // Click the remove button for the specific cart item
  const cartItems = await this.page.locator('.cart-item').all();
  for (const item of cartItems) {
    const name = await item.locator('.item-name').textContent();
    if (name?.includes(productName)) {
      await item.locator('.remove-btn, .delete-btn').click();
      await this.page.waitForTimeout(300);
      break;
    }
  }
});

// Then Steps
Then('the cart should contain {int} item', async function(this: CustomWorld, count: number) {
  const cartItems = await this.page.locator('.cart-item').count();
  expect(cartItems, `Cart should contain ${count} item`).toBe(count);
});

Then('the cart should be empty', async function(this: CustomWorld) {
  const isEmpty = await this.checkoutPage.isCartEmpty();
  expect(isEmpty, 'Cart should be empty').toBe(true);
});

Then('the cart total should be greater than {int}', async function(this: CustomWorld, amount: number) {
  const total = await this.dashboardPage.getCartTotalAmount();
  expect(total, `Cart total should be greater than ${amount}`).toBeGreaterThan(amount);
});

// Note: "the cart should be empty" step is defined in checkout.steps.ts
// Cucumber treats Given/When/Then as interchangeable, so "the cart is empty" matches

Then('the cart item {string} should have quantity {int}', async function(this: CustomWorld, productName: string, quantity: number) {
  const cartItems = await this.page.locator('.cart-item').all();
  for (const item of cartItems) {
    const name = await item.locator('.item-name').textContent();
    if (name?.includes(productName)) {
      const quantityText = await item.locator('.quantity-value, .item-quantity').textContent();
      const actualQuantity = parseInt(quantityText || '0');
      expect(actualQuantity, `${productName} should have quantity ${quantity}`).toBe(quantity);
      return;
    }
  }
  throw new Error(`Product ${productName} not found in cart`);
});
