Feature: Checkout Process
  As a logged-in user
  I want to complete the checkout process
  So that I can place an order and view my order history

  Background:
    Given the application is available
    And the user is logged in as "demo"
    And the language is set to English

  @smoke @checkout
  Scenario: Successful checkout with valid information
    Given the user has products in the cart
    When the user clicks the checkout button
    Then the checkout modal is displayed
    And the shipping information step is active
    When the user fills in the shipping information:
      | field       | value                    |
      | name        | John Doe                 |
      | email       | john.doe@example.com     |
      | phone       | 090-1234-5678           |
      | postalCode  | 100-0001                |
      | address     | Tokyo, Chiyoda 1-1      |
    And the user clicks next on shipping step
    Then the payment method step is active
    When the user selects "credit_card" as payment method
    And the user clicks next on payment step
    Then the order confirmation step is active
    And the order summary displays correct information
    When the user confirms the order
    Then the order complete screen is displayed
    And an order number is shown
    And the cart is empty

  @checkout @negative
  Scenario: Cannot proceed with empty required fields
    Given the user has products in the cart
    When the user clicks the checkout button
    Then the checkout modal is displayed
    When the user clicks next on shipping step without filling fields
    Then validation errors are displayed
    And the user remains on shipping step

  @checkout @negative
  Scenario: Invalid email format validation
    Given the user has products in the cart
    When the user clicks the checkout button
    And the user fills in the shipping information:
      | field       | value                    |
      | name        | John Doe                 |
      | email       | invalid-email           |
      | phone       | 090-1234-5678           |
      | postalCode  | 100-0001                |
      | address     | Tokyo, Chiyoda 1-1      |
    And the user clicks next on shipping step
    Then email validation error is displayed
    And the user remains on shipping step

  @checkout
  Scenario: Navigate back and forth between steps
    Given the user has products in the cart
    When the user clicks the checkout button
    And the user fills in valid shipping information
    And the user clicks next on shipping step
    Then the payment method step is active
    When the user clicks back on payment step
    Then the shipping information step is active
    And the shipping information is preserved
    When the user clicks next on shipping step
    And the user selects "bank_transfer" as payment method
    And the user clicks next on payment step
    Then the order confirmation step is active
    When the user clicks back on confirmation step
    Then the payment method step is active
    And "bank_transfer" is still selected

  @checkout
  Scenario: Checkout button disabled when cart is empty
    Given the cart is empty
    Then the checkout button is disabled
    And clicking checkout button does nothing

  @smoke @order-history
  Scenario: View order history after placing order
    Given the user has completed an order
    When the user clicks view order history button
    Then the order history modal is displayed
    And the recent order is shown with correct details:
      | field       | present |
      | orderNumber | true    |
      | orderDate   | true    |
      | items       | true    |
      | total       | true    |
      | shipping    | true    |
      | payment     | true    |

  @order-history
  Scenario: Empty order history message
    Given the user has no previous orders
    When the user clicks view order history button
    Then the order history modal is displayed
    And "No orders yet" message is shown

  @checkout
  Scenario: Order data persists after page reload
    Given the user has completed an order
    When the page is reloaded
    And the user logs in again as "demo"
    And the user clicks view order history button
    Then the previous order is still displayed

  @checkout
  Scenario: Different payment methods selection
    Given the user has products in the cart
    When the user completes checkout with "credit_card"
    Then the order is placed successfully
    When the user adds products to cart again
    And the user completes checkout with "bank_transfer"
    Then the order is placed successfully
    When the user adds products to cart again
    And the user completes checkout with "cash_on_delivery"
    Then the order is placed successfully
    When the user clicks view order history button
    Then all three orders are displayed with correct payment methods

  @checkout @responsive
  Scenario: Checkout modal scrollable on small screens
    Given the browser window height is 600px
    And the user has products in the cart
    When the user clicks the checkout button
    Then the checkout modal is scrollable
    And all buttons are accessible