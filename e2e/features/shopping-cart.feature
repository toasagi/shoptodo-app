# Shopping Cart Feature
# Maps to: TS-CART-001 to TS-CART-007
# Test Cases: TC-CART-001 to TC-CART-013
# Requirements: REQ-F-006, REQ-F-007, REQ-F-008 (Shopping Cart, Cart Management, Checkout)
# User Stories: US-008, US-009, US-010

@shopping-cart @smoke @regression
Feature: Shopping Cart Management
  As a general user
  I want to manage products in my shopping cart
  So that I can purchase selected items

  Background:
    Given the user is logged in as "demo"
    And the user is on the dashboard page
    And the cart is initially empty

  @smoke @priority-high
  Scenario: TC-CART-001 - Add first product to empty cart
    Given the cart is empty
    When the user adds "スマートフォン" to the cart
    Then the cart item count should be "1"
    And a cart item count badge should be displayed
    And a "商品をカートに追加しました" message should be shown
    And the cart data should be saved in localStorage

  @priority-high
  Scenario: TC-CART-002 - Add same product multiple times
    Given the cart contains "スマートフォン" with quantity 1
    When the user adds "スマートフォン" to the cart again
    Then the cart item count should be "2"
    And the "スマートフォン" quantity should be 2
    And no new cart line should be created

  @priority-medium
  Scenario: TC-CART-003 - Add different products to cart
    Given the cart contains "スマートフォン" with quantity 1
    When the user adds "ノートパソコン" to the cart
    Then the cart item count should be "2"
    And the cart should contain 2 different product lines:
      | スマートフォン | 1 |
      | ノートパソコン | 1 |

  @performance @priority-low
  Scenario: TC-CART-004 - Add large quantity of products
    Given the cart is empty
    When the user adds "スマートフォン" to the cart 10 times consecutively
    Then the cart item count should be "10"
    And the "スマートフォン" quantity should be 10
    And the application performance should remain responsive
    And the UI should remain stable

  @cart-page @priority-high
  Scenario: TC-CART-005 - View cart contents on cart page
    Given the cart contains the following items:
      | Product        | Quantity | Unit Price |
      | スマートフォン    | 1        | 89,800円   |
      | ノートパソコン    | 2        | 129,800円  |
    When the user navigates to the cart page
    Then the cart should display all items with correct information:
      | Product        | Quantity | Unit Price | Subtotal   |
      | スマートフォン    | 1        | 89,800円   | 89,800円   |
      | ノートパソコン    | 2        | 129,800円  | 259,600円  |
    And the total amount should be "349,400円"
    And quantity change and delete buttons should be available

  @cart-management @priority-high
  Scenario: TC-CART-006 - Increase product quantity in cart
    Given the cart contains "スマートフォン" with quantity 1
    And the user is on the cart page
    When the user changes the "スマートフォン" quantity to "3"
    Then the quantity should be updated to "3"
    And the subtotal should be updated to "269,400円"
    And the total amount should be recalculated
    And the localStorage should be updated

  @cart-management @priority-medium
  Scenario: TC-CART-007 - Decrease product quantity in cart
    Given the cart contains "スマートフォン" with quantity 3
    And the user is on the cart page
    When the user changes the "スマートフォン" quantity to "1"
    Then the quantity should be updated to "1"
    And the subtotal should be updated to "89,800円"
    And the total amount should be recalculated

  @cart-management @priority-low
  Scenario: TC-CART-008 - Set product quantity to zero
    Given the cart contains "スマートフォン" with quantity 1
    And the user is on the cart page
    When the user changes the "スマートフォン" quantity to "0"
    Then the "スマートフォン" should be removed from the cart
    And the cart item count should decrease
    And the total amount should be recalculated

  @cart-management @priority-medium
  Scenario: TC-CART-009 - Delete product using delete button
    Given the cart contains multiple products:
      | スマートフォン |
      | ノートパソコン |
    And the user is on the cart page
    When the user clicks the delete button for "スマートフォン"
    Then "スマートフォン" should be removed from the cart
    And "ノートパソコン" should remain in the cart
    And the total amount should be recalculated

  @validation @priority-low
  Scenario: TC-CART-010 - Invalid quantity input validation
    Given the cart contains "スマートフォン" with quantity 1
    And the user is on the cart page
    When the user enters "-1" as the quantity for "スマートフォン"
    Then a validation error should be displayed
    And the original quantity should be maintained
    And the invalid value should not be accepted

  @checkout @priority-high
  Scenario: TC-CART-011 - Successful checkout process
    Given the cart contains products with total value
    And the user is on the cart page
    When the user clicks the "チェックアウト" button
    And the checkout confirmation dialog appears
    And the user confirms the checkout
    Then a "購入が完了しました" message should be displayed
    And the cart should be emptied
    And the purchase history should be saved in localStorage
    And the user should be redirected to the dashboard

  @checkout @priority-medium
  Scenario: TC-CART-012 - Cancel checkout process
    Given the cart contains products
    And the user is on the cart page
    When the user clicks the "チェックアウト" button
    And the checkout confirmation dialog appears
    And the user cancels the checkout
    Then the checkout should be cancelled
    And the cart contents should be preserved
    And the user should remain on the cart page

  @edge-case @priority-low
  Scenario: TC-CART-013 - Attempt checkout with empty cart
    Given the cart is empty
    When the user navigates to the cart page
    Then an "カートが空です" message should be displayed
    And the "チェックアウト" button should be disabled
    And a "商品を追加してください" guidance should be shown

  @data-persistence @priority-medium
  Scenario: Cart data persistence across page reloads
    Given the cart contains "スマートフォン" with quantity 2
    When the user reloads the page
    Then the cart contents should be restored
    And the cart item count should still be "2"
    And the cart data should be maintained in localStorage

  @data-persistence @priority-medium
  Scenario: Cart data persistence across browser sessions
    Given the cart contains multiple products
    When the browser is closed and reopened
    And the user navigates to the application
    Then the cart contents should be restored
    And all product quantities should be maintained
    And the cart functionality should work normally