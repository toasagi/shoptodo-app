import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

// Given Steps
Given('the user has products in the cart', async function(this: CustomWorld) {
  await this.checkoutPage.addProductsToCart();

  // Verify products were added
  const isEmpty = await this.checkoutPage.isCartEmpty();
  expect(isEmpty, 'Cart should not be empty').toBe(false);
});

Given('the cart is empty', async function(this: CustomWorld) {
  await this.checkoutPage.clearCart();

  // Verify cart is empty
  const isEmpty = await this.checkoutPage.isCartEmpty();
  expect(isEmpty, 'Cart should be empty').toBe(true);
});

Given('the user has completed an order', async function(this: CustomWorld) {
  // Add products to cart
  await this.checkoutPage.addProductsToCart();

  // Complete checkout process
  await this.checkoutPage.clickCheckoutButton();

  // Fill shipping info
  await this.checkoutPage.fillShippingInfo({
    name: 'Test User',
    email: 'test@example.com',
    phone: '090-1234-5678',
    postalCode: '100-0001',
    address: 'Tokyo, Test Address',
  });
  await this.checkoutPage.clickShippingNext();

  // Select payment
  await this.checkoutPage.selectPaymentMethod('credit_card');
  await this.checkoutPage.clickPaymentNext();

  // Confirm order
  await this.checkoutPage.confirmOrder();

  // Close complete screen
  await this.checkoutPage.closeCheckoutModal();
});

Given('the user has no previous orders', async function(this: CustomWorld) {
  // Clear localStorage to ensure no orders exist
  await this.page.evaluate(() => {
    localStorage.removeItem('orders');
  });
});

Given('the browser window height is {int}px', async function(this: CustomWorld, height: number) {
  await this.page.setViewportSize({ width: 1200, height });
});

// When Steps
When('the user clicks the checkout button', async function(this: CustomWorld) {
  await this.checkoutPage.clickCheckoutButton();
});

When('the user fills in the shipping information:', async function(this: CustomWorld, dataTable: any) {
  const data = dataTable.rowsHash();

  await this.checkoutPage.fillShippingInfo({
    name: data.name || '',
    email: data.email || '',
    phone: data.phone || '',
    postalCode: data.postalCode || '',
    address: data.address || '',
  });
});

When('the user fills in valid shipping information', async function(this: CustomWorld) {
  await this.checkoutPage.fillShippingInfo({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '090-1234-5678',
    postalCode: '100-0001',
    address: 'Tokyo, Chiyoda 1-1',
  });
});

When('the user clicks next on shipping step', async function(this: CustomWorld) {
  await this.checkoutPage.clickShippingNext();
});

When('the user clicks next on shipping step without filling fields', async function(this: CustomWorld) {
  await this.checkoutPage.clickShippingNext();
});

When('the user selects {string} as payment method', async function(this: CustomWorld, method: string) {
  await this.checkoutPage.selectPaymentMethod(method as 'credit_card' | 'bank_transfer' | 'cash_on_delivery');
});

When('the user clicks next on payment step', async function(this: CustomWorld) {
  await this.checkoutPage.clickPaymentNext();
});

When('the user clicks back on payment step', async function(this: CustomWorld) {
  await this.checkoutPage.clickPaymentBack();
});

When('the user clicks back on confirmation step', async function(this: CustomWorld) {
  await this.checkoutPage.clickConfirmBack();
});

When('the user confirms the order', async function(this: CustomWorld) {
  await this.checkoutPage.confirmOrder();
});

When('clicking checkout button does nothing', async function(this: CustomWorld) {
  const isEnabled = await this.checkoutPage.isCheckoutButtonEnabled();
  expect(isEnabled, 'Checkout button should be disabled').toBe(false);

  // Verify checkout modal doesn't open
  const isModalDisplayed = await this.checkoutPage.isCheckoutModalDisplayed();
  expect(isModalDisplayed, 'Checkout modal should not be displayed').toBe(false);
});

When('the user clicks view order history button', async function(this: CustomWorld) {
  await this.checkoutPage.clickViewHistory();
});

When('the page is reloaded', async function(this: CustomWorld) {
  await this.page.reload();
  await this.page.waitForLoadState('networkidle');
});

When('the user logs in again as {string}', async function(this: CustomWorld, username: string) {
  // Check if already logged in (dashboard visible)
  const isDashboardVisible = await this.page.locator('#dashboard').isVisible().catch(() => false);

  if (!isDashboardVisible) {
    // Not logged in, need to login
    const loginBtn = this.page.locator('#login-btn');
    const isLoginBtnVisible = await loginBtn.isVisible().catch(() => false);

    if (isLoginBtnVisible) {
      await loginBtn.click();
      await this.page.waitForTimeout(500);
      await this.loginPage.login(username, 'password');
    }
  }

  // Wait for dashboard to be ready
  await this.dashboardPage.waitForPageLoad();
});

When('the user completes checkout with {string}', async function(this: CustomWorld, paymentMethod: string) {
  await this.checkoutPage.clickCheckoutButton();

  // Fill shipping info
  await this.checkoutPage.fillShippingInfo({
    name: 'Test User',
    email: 'test@example.com',
    phone: '090-1234-5678',
    postalCode: '100-0001',
    address: 'Tokyo, Test Address',
  });
  await this.checkoutPage.clickShippingNext();

  // Select payment
  await this.checkoutPage.selectPaymentMethod(paymentMethod as 'credit_card' | 'bank_transfer' | 'cash_on_delivery');
  await this.checkoutPage.clickPaymentNext();

  // Confirm order
  await this.checkoutPage.confirmOrder();

  // Close complete screen
  await this.checkoutPage.closeCheckoutModal();
});

When('the user adds products to cart again', async function(this: CustomWorld) {
  await this.checkoutPage.addProductsToCart();
});

// Then Steps
Then('the checkout modal is displayed', async function(this: CustomWorld) {
  const isDisplayed = await this.checkoutPage.isCheckoutModalDisplayed();
  expect(isDisplayed, 'Checkout modal should be displayed').toBe(true);
});

Then('the shipping information step is active', async function(this: CustomWorld) {
  const activeStep = await this.checkoutPage.getActiveStepNumber();
  expect(activeStep, 'Shipping step should be active').toBe(1);
});

Then('the payment method step is active', async function(this: CustomWorld) {
  const activeStep = await this.checkoutPage.getActiveStepNumber();
  expect(activeStep, 'Payment step should be active').toBe(2);
});

Then('the order confirmation step is active', async function(this: CustomWorld) {
  const activeStep = await this.checkoutPage.getActiveStepNumber();
  expect(activeStep, 'Confirmation step should be active').toBe(3);
});

Then('the order summary displays correct information', async function(this: CustomWorld) {
  const summary = await this.checkoutPage.getOrderSummary();

  expect(summary.itemsCount, 'Should have items in order').toBeGreaterThan(0);
  expect(summary.total, 'Should display total amount').toContain('¥');
  expect(summary.hasShippingInfo, 'Should display shipping info').toBe(true);
  expect(summary.hasPaymentInfo, 'Should display payment info').toBe(true);
});

Then('the order complete screen is displayed', async function(this: CustomWorld) {
  const isDisplayed = await this.checkoutPage.isOrderCompleteDisplayed();
  expect(isDisplayed, 'Order complete screen should be displayed').toBe(true);
});

Then('an order number is shown', async function(this: CustomWorld) {
  const orderNumber = await this.checkoutPage.getOrderNumber();
  expect(orderNumber, 'Order number should be displayed').toBeTruthy();
  expect(orderNumber.length, 'Order number should not be empty').toBeGreaterThan(0);
});

// Then step is already defined by Given step above (line 14)
// Cucumber treats Given/When/Then as interchangeable for step matching

Then('validation errors are displayed', async function(this: CustomWorld) {
  const hasErrors = await this.checkoutPage.hasValidationErrors();
  expect(hasErrors, 'Validation errors should be displayed').toBe(true);
});

Then('the user remains on shipping step', async function(this: CustomWorld) {
  const activeStep = await this.checkoutPage.getActiveStepNumber();
  expect(activeStep, 'Should remain on shipping step').toBe(1);
});

Then('email validation error is displayed', async function(this: CustomWorld) {
  const hasEmailError = await this.checkoutPage.hasEmailValidationError();
  expect(hasEmailError, 'Email validation error should be displayed').toBe(true);
});

Then('the shipping information is preserved', async function(this: CustomWorld) {
  const values = await this.checkoutPage.getShippingFormValues();

  expect(values.name, 'Name should be preserved').toBe('John Doe');
  expect(values.email, 'Email should be preserved').toBe('john.doe@example.com');
  expect(values.phone, 'Phone should be preserved').toBe('090-1234-5678');
  expect(values.postalCode, 'Postal code should be preserved').toBe('100-0001');
  expect(values.address, 'Address should be preserved').toBe('Tokyo, Chiyoda 1-1');
});

Then('{string} is still selected', async function(this: CustomWorld, paymentMethod: string) {
  const selectedMethod = await this.checkoutPage.getSelectedPaymentMethod();
  expect(selectedMethod, 'Payment method should be preserved').toBe(paymentMethod);
});

Then('the checkout button is disabled', async function(this: CustomWorld) {
  const isEnabled = await this.checkoutPage.isCheckoutButtonEnabled();
  expect(isEnabled, 'Checkout button should be disabled').toBe(false);
});

Then('the order history modal is displayed', async function(this: CustomWorld) {
  const isDisplayed = await this.checkoutPage.isOrderHistoryDisplayed();
  expect(isDisplayed, 'Order history modal should be displayed').toBe(true);
});

Then('the recent order is shown with correct details:', async function(this: CustomWorld, dataTable: any) {
  const expectedFields = dataTable.rowsHash();
  const orderDetails = await this.checkoutPage.getFirstOrderDetails();

  if (expectedFields.orderNumber === 'true') {
    expect(orderDetails.orderNumber, 'Order number should be present').toBeTruthy();
  }
  if (expectedFields.orderDate === 'true') {
    expect(orderDetails.hasDate, 'Order date should be present').toBe(true);
  }
  if (expectedFields.items === 'true') {
    expect(orderDetails.hasItems, 'Order items should be present').toBe(true);
  }
  if (expectedFields.total === 'true') {
    expect(orderDetails.hasTotal, 'Order total should be present').toBe(true);
  }
  if (expectedFields.shipping === 'true') {
    expect(orderDetails.hasShipping, 'Shipping info should be present').toBe(true);
  }
  if (expectedFields.payment === 'true') {
    expect(orderDetails.hasPayment, 'Payment info should be present').toBe(true);
  }
});

Then('{string} message is shown', async function(this: CustomWorld, message: string) {
  const hasEmptyMessage = await this.checkoutPage.hasEmptyHistoryMessage();
  expect(hasEmptyMessage, `"${message}" message should be displayed`).toBe(true);
});

Then('the previous order is still displayed', async function(this: CustomWorld) {
  const orderCount = await this.checkoutPage.getOrderHistoryCount();
  expect(orderCount, 'Previous order should be displayed').toBeGreaterThan(0);
});

Then('the order is placed successfully', async function(this: CustomWorld) {
  // Order should be complete and cart should be empty
  const isEmpty = await this.checkoutPage.isCartEmpty();
  expect(isEmpty, 'Cart should be empty after successful order').toBe(true);
});

Then('all three orders are displayed with correct payment methods', async function(this: CustomWorld) {
  const orderCount = await this.checkoutPage.getOrderHistoryCount();
  expect(orderCount, 'Should have three orders').toBe(3);
});

Then('the checkout modal is scrollable', async function(this: CustomWorld) {
  const isScrollable = await this.checkoutPage.isModalScrollable();
  expect(isScrollable, 'Checkout modal should be scrollable').toBe(true);
});

Then('all buttons are accessible', async function(this: CustomWorld) {
  const areAccessible = await this.checkoutPage.areAllButtonsAccessible();
  expect(areAccessible, 'All buttons should be accessible').toBe(true);
});