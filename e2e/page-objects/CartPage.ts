import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Cart Page Object - Shopping cart management page
 * Maps to: TC-CART-005 to TC-CART-013
 * Requirements: REQ-F-007, REQ-F-008 (Cart Management, Checkout)
 * User Stories: US-009, US-010
 */
export class CartPage extends BasePage {
  // Page Elements
  private readonly cartContainer: Locator;
  private readonly cartItems: Locator;
  private readonly emptyCartMessage: Locator;
  private readonly totalAmountDisplay: Locator;
  private readonly checkoutButton: Locator;
  private readonly checkoutConfirmDialog: Locator;
  private readonly confirmCheckoutButton: Locator;
  private readonly cancelCheckoutButton: Locator;
  private readonly successMessage: Locator;
  private readonly backToDashboardButton: Locator;

  constructor(page: Page) {
    super(page, '/#cart'); // Assuming SPA routing

    // Initialize locators
    this.cartContainer = this.page.locator('#cartContainer');
    this.cartItems = this.page.locator('.cart-item');
    this.emptyCartMessage = this.page.locator('#emptyCartMessage');
    this.totalAmountDisplay = this.page.locator('#totalAmount');
    this.checkoutButton = this.page.locator('#checkoutBtn');
    this.checkoutConfirmDialog = this.page.locator('#checkoutConfirmDialog');
    this.confirmCheckoutButton = this.page.locator('#confirmCheckoutBtn');
    this.cancelCheckoutButton = this.page.locator('#cancelCheckoutBtn');
    this.successMessage = this.page.locator('#successMessage');
    this.backToDashboardButton = this.page.locator('#backToDashboardBtn');
  }

  /**
   * Navigate to cart page
   */
  async navigateToCart(): Promise<void> {
    // Click cart icon from dashboard
    await this.page.locator('#cartIcon').click();
    await this.waitForPageLoad();
  }

  // Cart Display Methods

  /**
   * TC-CART-005: Cart content display
   * Get number of items in cart
   */
  async getCartItemCount(): Promise<number> {
    await this.waitForElementVisible(this.cartContainer);
    return await this.cartItems.count();
  }

  /**
   * TC-CART-005: Cart content display
   * Get cart item information by index
   */
  async getCartItemInfo(index: number): Promise<{
    name: string;
    quantity: string;
    unitPrice: string;
    subtotal: string;
  }> {
    const cartItem = this.cartItems.nth(index);
    await this.waitForElementVisible(cartItem);

    const name = await cartItem.locator('.item-name').textContent() || '';
    const quantity = await cartItem.locator('.quantity-input').inputValue() || '';
    const unitPrice = await cartItem.locator('.unit-price').textContent() || '';
    const subtotal = await cartItem.locator('.subtotal').textContent() || '';

    return { name, quantity, unitPrice, subtotal };
  }

  /**
   * TC-CART-005: Cart content display
   * Get total amount
   */
  async getTotalAmount(): Promise<string> {
    return await this.getElementText(this.totalAmountDisplay);
  }

  /**
   * TC-CART-013: Empty cart
   * Check if empty cart message is displayed
   */
  async isEmptyCartMessageDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.emptyCartMessage);
  }

  /**
   * TC-CART-013: Empty cart
   * Get empty cart message text
   */
  async getEmptyCartMessage(): Promise<string> {
    return await this.getElementText(this.emptyCartMessage);
  }

  // Quantity Management Methods

  /**
   * TC-CART-006, TC-CART-007: Quantity changes
   * Change quantity for specific item by name
   */
  async changeItemQuantity(itemName: string, newQuantity: string): Promise<void> {
    const cartItem = this.page.locator('.cart-item').filter({ hasText: itemName });
    const quantityInput = cartItem.locator('.quantity-input');

    await this.fillInput(quantityInput, newQuantity);

    // Trigger change event (might need to press Enter or click elsewhere)
    await quantityInput.press('Enter');
    await this.page.waitForTimeout(500); // Wait for calculation update
  }

  /**
   * TC-CART-006: Quantity increase
   * Increase item quantity by clicking plus button
   */
  async increaseItemQuantity(itemName: string): Promise<void> {
    const cartItem = this.page.locator('.cart-item').filter({ hasText: itemName });
    const plusButton = cartItem.locator('.quantity-plus');
    await this.clickElement(plusButton);
    await this.page.waitForTimeout(500);
  }

  /**
   * TC-CART-007: Quantity decrease
   * Decrease item quantity by clicking minus button
   */
  async decreaseItemQuantity(itemName: string): Promise<void> {
    const cartItem = this.page.locator('.cart-item').filter({ hasText: itemName });
    const minusButton = cartItem.locator('.quantity-minus');
    await this.clickElement(minusButton);
    await this.page.waitForTimeout(500);
  }

  /**
   * TC-CART-008: Set quantity to zero
   * Set item quantity to zero
   */
  async setItemQuantityToZero(itemName: string): Promise<void> {
    await this.changeItemQuantity(itemName, '0');
  }

  /**
   * Get current quantity for specific item
   */
  async getItemQuantity(itemName: string): Promise<string> {
    const cartItem = this.page.locator('.cart-item').filter({ hasText: itemName });
    const quantityInput = cartItem.locator('.quantity-input');
    return await quantityInput.inputValue();
  }

  /**
   * Get subtotal for specific item
   */
  async getItemSubtotal(itemName: string): Promise<string> {
    const cartItem = this.page.locator('.cart-item').filter({ hasText: itemName });
    const subtotalElement = cartItem.locator('.subtotal');
    return await this.getElementText(subtotalElement);
  }

  // Item Removal Methods

  /**
   * TC-CART-009: Item deletion
   * Delete item from cart by clicking delete button
   */
  async deleteItem(itemName: string): Promise<void> {
    const cartItem = this.page.locator('.cart-item').filter({ hasText: itemName });
    const deleteButton = cartItem.locator('.delete-btn');
    await this.clickElement(deleteButton);
    await this.page.waitForTimeout(500);
  }

  /**
   * Check if item exists in cart
   */
  async isItemInCart(itemName: string): Promise<boolean> {
    const cartItem = this.page.locator('.cart-item').filter({ hasText: itemName });
    return await this.isElementVisible(cartItem);
  }

  // Validation Methods for Invalid Input

  /**
   * TC-CART-010: Invalid quantity input
   * Enter invalid quantity (negative number)
   */
  async enterInvalidQuantity(itemName: string, invalidQuantity: string): Promise<void> {
    const cartItem = this.page.locator('.cart-item').filter({ hasText: itemName });
    const quantityInput = cartItem.locator('.quantity-input');

    await this.fillInput(quantityInput, invalidQuantity);
    await quantityInput.press('Enter');
    await this.page.waitForTimeout(500);
  }

  /**
   * TC-CART-010: Invalid quantity input
   * Check if validation error is displayed
   */
  async isQuantityValidationErrorDisplayed(itemName: string): Promise<boolean> {
    const cartItem = this.page.locator('.cart-item').filter({ hasText: itemName });
    const errorElement = cartItem.locator('.quantity-error');
    return await this.isElementVisible(errorElement);
  }

  /**
   * TC-CART-010: Invalid quantity input
   * Get validation error message
   */
  async getQuantityValidationError(itemName: string): Promise<string> {
    const cartItem = this.page.locator('.cart-item').filter({ hasText: itemName });
    const errorElement = cartItem.locator('.quantity-error');
    return await this.getElementText(errorElement);
  }

  // Checkout Methods

  /**
   * TC-CART-011: Normal checkout
   * Click checkout button
   */
  async clickCheckoutButton(): Promise<void> {
    await this.clickElement(this.checkoutButton);
  }

  /**
   * TC-CART-011: Normal checkout
   * Check if checkout button is enabled
   */
  async isCheckoutButtonEnabled(): Promise<boolean> {
    return await this.checkoutButton.isEnabled();
  }

  /**
   * TC-CART-013: Empty cart checkout
   * Check if checkout button is disabled
   */
  async isCheckoutButtonDisabled(): Promise<boolean> {
    return await this.checkoutButton.isDisabled();
  }

  /**
   * TC-CART-011: Normal checkout
   * Check if checkout confirmation dialog is displayed
   */
  async isCheckoutConfirmDialogDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.checkoutConfirmDialog);
  }

  /**
   * TC-CART-011: Normal checkout
   * Confirm checkout in dialog
   */
  async confirmCheckout(): Promise<void> {
    await this.clickElement(this.confirmCheckoutButton);
    await this.page.waitForTimeout(1000); // Wait for processing
  }

  /**
   * TC-CART-012: Checkout cancellation
   * Cancel checkout in dialog
   */
  async cancelCheckout(): Promise<void> {
    await this.clickElement(this.cancelCheckoutButton);
  }

  /**
   * TC-CART-011: Normal checkout
   * Check if success message is displayed
   */
  async isSuccessMessageDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.successMessage);
  }

  /**
   * TC-CART-011: Normal checkout
   * Get success message text
   */
  async getSuccessMessage(): Promise<string> {
    return await this.getElementText(this.successMessage);
  }

  /**
   * Navigate back to dashboard after checkout
   */
  async navigateBackToDashboard(): Promise<void> {
    await this.clickElement(this.backToDashboardButton);
  }

  // Complex Operations

  /**
   * TC-CART-011: Complete checkout process
   * Execute full checkout flow
   */
  async completeCheckout(): Promise<void> {
    await this.clickCheckoutButton();
    await this.confirmCheckout();
  }

  /**
   * TC-CART-012: Cancel checkout process
   * Execute checkout cancellation flow
   */
  async cancelCheckoutProcess(): Promise<void> {
    await this.clickCheckoutButton();
    await this.cancelCheckout();
  }

  // Data Persistence Methods

  /**
   * Check cart data in localStorage
   */
  async getCartDataFromStorage(): Promise<any> {
    const cartData = await this.getLocalStorageItem('cartData');
    return cartData ? JSON.parse(cartData) : null;
  }

  /**
   * Check if cart is empty after checkout
   */
  async isCartEmptyAfterCheckout(): Promise<boolean> {
    const cartData = await this.getCartDataFromStorage();
    return !cartData || cartData.length === 0;
  }

  // Validation Methods

  /**
   * TC-CART-005: Assert cart content display
   */
  async assertCartContentDisplay(expectedItems: Array<{
    name: string;
    quantity: number;
    expectedSubtotal: string;
  }>): Promise<void> {
    const itemCount = await this.getCartItemCount();
    if (itemCount !== expectedItems.length) {
      throw new Error(`Expected ${expectedItems.length} items in cart, but found ${itemCount}`);
    }

    for (let i = 0; i < expectedItems.length; i++) {
      const itemInfo = await this.getCartItemInfo(i);
      const expected = expectedItems[i];

      if (!itemInfo.name.includes(expected.name)) {
        throw new Error(`Expected item name to contain "${expected.name}", but got "${itemInfo.name}"`);
      }

      if (parseInt(itemInfo.quantity) !== expected.quantity) {
        throw new Error(`Expected quantity ${expected.quantity}, but got ${itemInfo.quantity}`);
      }
    }
  }

  /**
   * TC-CART-006, TC-CART-007: Assert quantity change
   */
  async assertQuantityChange(itemName: string, expectedQuantity: string, expectedSubtotal?: string): Promise<void> {
    const actualQuantity = await this.getItemQuantity(itemName);
    if (actualQuantity !== expectedQuantity) {
      throw new Error(`Expected quantity ${expectedQuantity}, but got ${actualQuantity} for item ${itemName}`);
    }

    if (expectedSubtotal) {
      const actualSubtotal = await this.getItemSubtotal(itemName);
      if (!actualSubtotal.includes(expectedSubtotal)) {
        throw new Error(`Expected subtotal to contain ${expectedSubtotal}, but got ${actualSubtotal} for item ${itemName}`);
      }
    }
  }

  /**
   * TC-CART-009: Assert item deletion
   */
  async assertItemDeleted(itemName: string): Promise<void> {
    const exists = await this.isItemInCart(itemName);
    if (exists) {
      throw new Error(`Item "${itemName}" should be deleted from cart`);
    }
  }

  /**
   * TC-CART-011: Assert successful checkout
   */
  async assertSuccessfulCheckout(): Promise<void> {
    await this.assertElementVisible(this.successMessage, 'Success message should be displayed');
    await this.assertElementContainsText(this.successMessage, '購入が完了しました',
      'Success message should contain completion text');

    // Check if cart is empty after checkout
    const isEmpty = await this.isCartEmptyAfterCheckout();
    if (!isEmpty) {
      throw new Error('Cart should be empty after successful checkout');
    }
  }

  /**
   * TC-CART-012: Assert checkout cancellation
   */
  async assertCheckoutCancellation(): Promise<void> {
    // Dialog should be closed
    const dialogVisible = await this.isCheckoutConfirmDialogDisplayed();
    if (dialogVisible) {
      throw new Error('Checkout confirmation dialog should be closed after cancellation');
    }

    // Should remain on cart page
    await this.assertElementVisible(this.cartContainer, 'Should remain on cart page after cancellation');

    // Cart content should be preserved
    const itemCount = await this.getCartItemCount();
    if (itemCount === 0) {
      throw new Error('Cart content should be preserved after checkout cancellation');
    }
  }

  /**
   * TC-CART-013: Assert empty cart state
   */
  async assertEmptyCartState(): Promise<void> {
    await this.assertElementVisible(this.emptyCartMessage, 'Empty cart message should be displayed');
    if (await this.isCheckoutButtonEnabled()) {
      throw new Error('Checkout button should be disabled for empty cart');
    }
  }
}