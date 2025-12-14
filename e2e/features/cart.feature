Feature: Shopping Cart Operations
  As a logged-in user
  I want to manage items in my shopping cart
  So that I can prepare for checkout

  Background:
    Given the application is available
    And the user is logged in as "demo"
    And the language is set to English

  @smoke @cart
  Scenario: Add a product to the cart
    Given the cart is empty
    When the user adds "Smartphone" to the cart
    Then the cart should contain 1 item
    And the cart total should be greater than 0

  @smoke @cart
  Scenario: Remove item from cart
    Given the user has "Smartphone" in the cart
    When the user removes "Smartphone" from the cart
    Then the cart should be empty

  @smoke @cart
  Scenario: Update item quantity in cart
    Given the user has "Smartphone" in the cart
    When the user adds "Smartphone" to the cart again
    Then the cart item "Smartphone" should have quantity 2

  # ============================================
  # Japanese UI Test Scenarios (Issue #27)
  # ============================================

  @i18n @cart @japanese-ui
  Scenario: Add product to cart in Japanese UI
    Given the language is set to Japanese
    And the cart is empty
    When the user adds "スマートフォン" to the cart
    Then the cart should contain 1 item
    And the cart item should display "スマートフォン"

  @i18n @cart @language-switch
  Scenario: Cart product names update after language switch
    Given the language is set to English
    And the user has "Smartphone" in the cart
    When the user switches language to Japanese
    Then the cart item should display "スマートフォン"

  @i18n @cart @language-switch
  Scenario: Cart persists items after language switch to English
    Given the language is set to Japanese
    And the user has "スマートフォン" in the cart
    When the user switches language to English
    Then the cart should contain 1 item
    And the cart item should display "Smartphone"
