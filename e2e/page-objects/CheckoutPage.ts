import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
  private page: Page;

  // Checkout Modal Locators
  private checkoutButton: Locator;
  private checkoutModal: Locator;
  private checkoutClose: Locator;

  // Step Indicators
  private stepIndicators: Locator;
  private activeStep: Locator;

  // Shipping Information Form
  private shippingName: Locator;
  private shippingEmail: Locator;
  private shippingPhone: Locator;
  private shippingPostal: Locator;
  private shippingAddress: Locator;
  private shippingNext: Locator;

  // Payment Method Form
  private paymentMethods: Locator;
  private creditCardOption: Locator;
  private bankTransferOption: Locator;
  private cashOnDeliveryOption: Locator;
  private paymentBack: Locator;
  private paymentNext: Locator;

  // Order Confirmation
  private orderItemsList: Locator;
  private orderTotalAmount: Locator;
  private orderShippingInfo: Locator;
  private orderPaymentInfo: Locator;
  private confirmBack: Locator;
  private confirmOrderButton: Locator;

  // Order Complete
  private orderNumberDisplay: Locator;
  private closeCheckout: Locator;

  // Order History
  private viewHistoryButton: Locator;
  private orderHistoryModal: Locator;
  private orderHistoryList: Locator;
  private historyClose: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize checkout modal locators
    this.checkoutButton = page.locator('#checkout-btn');
    this.checkoutModal = page.locator('#checkout-modal');
    this.checkoutClose = page.locator('#checkout-close');

    // Step indicators
    this.stepIndicators = page.locator('.checkout-steps .step');
    this.activeStep = page.locator('.checkout-steps .step.active');

    // Shipping form
    this.shippingName = page.locator('#shipping-name');
    this.shippingEmail = page.locator('#shipping-email');
    this.shippingPhone = page.locator('#shipping-phone');
    this.shippingPostal = page.locator('#shipping-postal');
    this.shippingAddress = page.locator('#shipping-address');
    this.shippingNext = page.locator('#shipping-next');

    // Payment form
    this.paymentMethods = page.locator('.payment-methods');
    this.creditCardOption = page.locator('label.payment-option:has(input[value="credit_card"])');
    this.bankTransferOption = page.locator('label.payment-option:has(input[value="bank_transfer"])');
    this.cashOnDeliveryOption = page.locator('label.payment-option:has(input[value="cash_on_delivery"])');
    this.paymentBack = page.locator('#payment-back');
    this.paymentNext = page.locator('#payment-next');

    // Order confirmation
    this.orderItemsList = page.locator('#order-items-list');
    this.orderTotalAmount = page.locator('#order-total-amount');
    this.orderShippingInfo = page.locator('#order-shipping-info');
    this.orderPaymentInfo = page.locator('#order-payment-info');
    this.confirmBack = page.locator('#confirm-back');
    this.confirmOrderButton = page.locator('#confirm-order');

    // Order complete
    this.orderNumberDisplay = page.locator('#order-number-display');
    this.closeCheckout = page.locator('#close-checkout');

    // Order history
    this.viewHistoryButton = page.locator('#view-history-btn');
    this.orderHistoryModal = page.locator('#order-history-modal');
    this.orderHistoryList = page.locator('#order-history-list');
    this.historyClose = page.locator('#history-close');
  }

  /**
   * Click checkout button
   */
  async clickCheckoutButton(): Promise<void> {
    // Ensure button is enabled before clicking
    await this.checkoutButton.waitFor({ state: 'visible', timeout: 5000 });
    const isEnabled = await this.checkoutButton.isEnabled();
    if (!isEnabled) {
      throw new Error('Checkout button is disabled');
    }
    await this.checkoutButton.click();
    await this.page.waitForTimeout(1000); // Wait for modal animation
  }

  /**
   * Check if checkout button is enabled
   */
  async isCheckoutButtonEnabled(): Promise<boolean> {
    return await this.checkoutButton.isEnabled();
  }

  /**
   * Check if checkout modal is displayed
   */
  async isCheckoutModalDisplayed(): Promise<boolean> {
    try {
      await this.checkoutModal.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get active step number
   */
  async getActiveStepNumber(): Promise<number> {
    const activeStepElement = await this.activeStep.first();
    const stepDataAttr = await activeStepElement.getAttribute('data-step');
    return parseInt(stepDataAttr || '0');
  }

  /**
   * Fill shipping information
   */
  async fillShippingInfo(data: {
    name: string;
    email: string;
    phone: string;
    postalCode: string;
    address: string;
  }): Promise<void> {
    await this.shippingName.fill(data.name);
    await this.shippingEmail.fill(data.email);
    await this.shippingPhone.fill(data.phone);
    await this.shippingPostal.fill(data.postalCode);
    await this.shippingAddress.fill(data.address);
  }

  /**
   * Get shipping form values
   */
  async getShippingFormValues(): Promise<{
    name: string;
    email: string;
    phone: string;
    postalCode: string;
    address: string;
  }> {
    return {
      name: await this.shippingName.inputValue(),
      email: await this.shippingEmail.inputValue(),
      phone: await this.shippingPhone.inputValue(),
      postalCode: await this.shippingPostal.inputValue(),
      address: await this.shippingAddress.inputValue(),
    };
  }

  /**
   * Click next on shipping step
   */
  async clickShippingNext(): Promise<void> {
    await this.shippingNext.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Select payment method
   */
  async selectPaymentMethod(method: 'credit_card' | 'bank_transfer' | 'cash_on_delivery'): Promise<void> {
    // Wait for payment methods section to be visible
    await this.paymentMethods.waitFor({ state: 'visible', timeout: 5000 });

    // Click the label (not the hidden input)
    switch (method) {
      case 'credit_card':
        await this.creditCardOption.click();
        break;
      case 'bank_transfer':
        await this.bankTransferOption.click();
        break;
      case 'cash_on_delivery':
        await this.cashOnDeliveryOption.click();
        break;
    }

    await this.page.waitForTimeout(300);
  }

  /**
   * Get selected payment method
   */
  async getSelectedPaymentMethod(): Promise<string | null> {
    const methods = ['credit_card', 'bank_transfer', 'cash_on_delivery'];
    for (const method of methods) {
      const input = this.page.locator(`input[value="${method}"]`);
      if (await input.isChecked()) {
        return method;
      }
    }
    return null;
  }

  /**
   * Click next on payment step
   */
  async clickPaymentNext(): Promise<void> {
    await this.paymentNext.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Click back on payment step
   */
  async clickPaymentBack(): Promise<void> {
    await this.paymentBack.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Click back on confirmation step
   */
  async clickConfirmBack(): Promise<void> {
    await this.confirmBack.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Get order summary information
   */
  async getOrderSummary(): Promise<{
    itemsCount: number;
    total: string;
    hasShippingInfo: boolean;
    hasPaymentInfo: boolean;
  }> {
    const items = await this.orderItemsList.locator('.order-item').count();
    const total = await this.orderTotalAmount.textContent() || '';
    const shippingInfo = await this.orderShippingInfo.textContent() || '';
    const paymentInfo = await this.orderPaymentInfo.textContent() || '';

    return {
      itemsCount: items,
      total: total.trim(),
      hasShippingInfo: shippingInfo.length > 0,
      hasPaymentInfo: paymentInfo.length > 0,
    };
  }

  /**
   * Confirm order
   */
  async confirmOrder(): Promise<void> {
    await this.confirmOrderButton.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Check if order complete screen is displayed
   */
  async isOrderCompleteDisplayed(): Promise<boolean> {
    try {
      const completeSection = this.page.locator('.checkout-step-content[data-step="4"]');
      await completeSection.waitFor({ state: 'visible', timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get order number
   */
  async getOrderNumber(): Promise<string> {
    return await this.orderNumberDisplay.textContent() || '';
  }

  /**
   * Close checkout modal
   */
  async closeCheckoutModal(): Promise<void> {
    await this.closeCheckout.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Click view order history button
   */
  async clickViewHistory(): Promise<void> {
    await this.viewHistoryButton.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Check if order history modal is displayed
   */
  async isOrderHistoryDisplayed(): Promise<boolean> {
    try {
      await this.orderHistoryModal.waitFor({ state: 'visible', timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get order history items count
   */
  async getOrderHistoryCount(): Promise<number> {
    return await this.orderHistoryList.locator('.order-history-item').count();
  }

  /**
   * Check if empty history message is displayed
   */
  async hasEmptyHistoryMessage(): Promise<boolean> {
    const emptyMessage = await this.orderHistoryList.locator('.empty-history').count();
    return emptyMessage > 0;
  }

  /**
   * Get first order details from history
   */
  async getFirstOrderDetails(): Promise<{
    orderNumber: string;
    hasDate: boolean;
    hasItems: boolean;
    hasTotal: boolean;
    hasShipping: boolean;
    hasPayment: boolean;
  }> {
    const firstOrder = this.orderHistoryList.locator('.order-history-item').first();

    const orderNumber = await firstOrder.locator('.order-id').textContent() || '';
    const orderDate = await firstOrder.locator('.order-date-text').textContent() || '';
    const items = await firstOrder.locator('.order-item-line').count();
    const total = await firstOrder.locator('.order-total-line').textContent() || '';
    const shipping = await firstOrder.locator('.order-shipping-summary').textContent() || '';

    return {
      orderNumber: orderNumber.trim(),
      hasDate: orderDate.length > 0,
      hasItems: items > 0,
      hasTotal: total.length > 0,
      hasShipping: shipping.includes('Tokyo') || shipping.includes('東京'),
      hasPayment: shipping.includes('credit_card') || shipping.includes('bank_transfer') || shipping.includes('cash_on_delivery'),
    };
  }

  /**
   * Close order history modal
   */
  async closeOrderHistory(): Promise<void> {
    await this.historyClose.click();
    await this.page.waitForTimeout(300);
  }

  /**
   * Check if validation errors are displayed
   */
  async hasValidationErrors(): Promise<boolean> {
    // Check if browser's native validation messages appear
    const nameValidity = await this.shippingName.evaluate((el: HTMLInputElement) => el.validity.valid);
    const emailValidity = await this.shippingEmail.evaluate((el: HTMLInputElement) => el.validity.valid);

    return !nameValidity || !emailValidity;
  }

  /**
   * Check if email validation error is displayed
   */
  async hasEmailValidationError(): Promise<boolean> {
    const emailValidity = await this.shippingEmail.evaluate((el: HTMLInputElement) => {
      return !el.validity.valid && el.validity.typeMismatch;
    });

    return emailValidity;
  }

  /**
   * Check if modal is scrollable
   */
  async isModalScrollable(): Promise<boolean> {
    const modalContent = this.page.locator('.checkout-modal-content');
    const isScrollable = await modalContent.evaluate((el) => {
      return el.scrollHeight > el.clientHeight;
    });

    return isScrollable;
  }

  /**
   * Check if all buttons are accessible in viewport
   */
  async areAllButtonsAccessible(): Promise<boolean> {
    const nextButton = this.shippingNext;

    try {
      // Wait for button to be visible
      await nextButton.waitFor({ state: 'visible', timeout: 3000 });

      // Check if button is visible
      const isVisible = await nextButton.isVisible();

      if (!isVisible) {
        // Try scrolling to the button
        await nextButton.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(300);
        // Check again after scrolling
        return await nextButton.isVisible();
      }

      // Try to check if clickable (which means it's accessible)
      await nextButton.scrollIntoViewIfNeeded();
      await this.page.waitForTimeout(200);

      return true;
    } catch (error) {
      console.error('Button accessibility check failed:', error);
      return false;
    }
  }

  /**
   * Add products to cart for testing
   */
  async addProductsToCart(): Promise<void> {
    // Add first product to cart
    const firstProduct = this.page.locator('.product-card button').first();
    await firstProduct.click();
    await this.page.waitForTimeout(1000); // Wait for cart to update

    // Add second product
    const secondProduct = this.page.locator('.product-card button').nth(1);
    await secondProduct.click();
    await this.page.waitForTimeout(1000); // Wait for cart to update

    // Wait for checkout button to be enabled
    await this.checkoutButton.waitFor({ state: 'visible', timeout: 3000 });
    // Give extra time for the button to become enabled
    await this.page.waitForTimeout(500);
  }

  /**
   * Clear cart
   */
  async clearCart(): Promise<void> {
    const cartItems = await this.page.locator('.cart-item').count();

    for (let i = 0; i < cartItems; i++) {
      // Always remove the first item (as the list updates)
      const removeButton = this.page.locator('.cart-item button[title*="削除"], .cart-item button[title*="Delete"]').first();
      await removeButton.click();
      await this.page.waitForTimeout(300);
    }
  }

  /**
   * Check if cart is empty
   */
  async isCartEmpty(): Promise<boolean> {
    const emptyMessage = await this.page.locator('.empty-cart').count();
    return emptyMessage > 0;
  }
}