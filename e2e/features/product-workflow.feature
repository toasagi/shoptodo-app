Feature: Product Browsing and Purchase Workflow
  As a user of ShopTodo
  I want to browse products and complete purchases
  So that I can shop efficiently from discovery to checkout

  Background:
    Given the application is available

  # ============================================
  # Complete End-to-End Workflow Scenarios
  # ============================================

  @smoke @workflow @e2e
  Scenario: Complete purchase workflow from login to order history
    # Step 1: Login
    When the user clicks the login button to open modal
    And the user enters username "demo"
    And the user enters password "password"
    And the user submits the login form
    Then the user should be logged in successfully

    # Step 2: Browse recommended products
    And the recommended section should be visible
    And the recommended section should contain 4 products

    # Step 3: Add product from recommended section
    When the user adds the first recommended product to cart
    Then the cart should contain 1 item

    # Step 4: Browse by category and add more
    When the user clicks the "Clothing" category tab
    And the user adds the first product in the list to cart
    Then the cart should contain 2 items

    # Step 5: Complete checkout
    When the user clicks the checkout button
    And the user fills in valid shipping information
    And the user clicks next on shipping step
    And the user selects "credit_card" as payment method
    And the user clicks next on payment step
    And the user confirms the order
    Then the order complete screen is displayed
    And an order number is shown

    # Step 6: Verify order history
    When the user closes the checkout modal
    And the user clicks view order history button
    Then the order history modal is displayed
    And the recent order should be displayed

  @workflow @recommended-to-purchase
  Scenario: Purchase recommended product directly
    Given the user is logged in as "demo"
    And the language is set to English

    # Browse and select from recommended
    When the user adds the first recommended product to cart
    Then the cart should contain 1 item

    # Quick checkout
    When the user clicks the checkout button
    And the user fills in valid shipping information
    And the user clicks next on shipping step
    And the user selects "cash_on_delivery" as payment method
    And the user clicks next on payment step
    And the user confirms the order
    Then the order complete screen is displayed

  @workflow @category-to-purchase
  Scenario: Browse category and purchase multiple items
    Given the user is logged in as "demo"
    And the language is set to English

    # Browse Electronics
    When the user clicks the "Electronics" category tab
    And the user adds the first product in the list to cart
    Then the cart should contain 1 item

    # Browse Books
    When the user clicks the "Books" category tab
    And the user adds the first product in the list to cart
    Then the cart should contain 2 items

    # Complete checkout
    When the user clicks the checkout button
    And the user fills in valid shipping information
    And the user clicks next on shipping step
    And the user selects "bank_transfer" as payment method
    And the user clicks next on payment step
    Then the order summary should show 2 items
    When the user confirms the order
    Then the order complete screen is displayed

  @workflow @search-to-purchase
  Scenario: Search for product and purchase
    Given the user is logged in as "demo"
    And the language is set to English

    # Search and add
    When the user searches for "スマートフォン"
    Then the search results should contain "Smartphone"
    When the user adds "Smartphone" to the cart
    Then the cart should contain 1 item

    # Checkout
    When the user clicks the checkout button
    And the user fills in valid shipping information
    And the user clicks next on shipping step
    And the user selects "credit_card" as payment method
    And the user clicks next on payment step
    And the user confirms the order
    Then the order complete screen is displayed

  # ============================================
  # Japanese UI Workflow Scenarios
  # ============================================

  @i18n @workflow @japanese-ui
  Scenario: Complete purchase workflow in Japanese UI
    Given the language is set to Japanese

    # Login in Japanese
    When the user clicks the login button to open modal
    And the user enters username "demo"
    And the user enters password "password"
    And the user submits the login form
    Then the user should be logged in successfully

    # Browse recommended in Japanese
    Then the recommended section title should be "おすすめ商品"
    When the user adds the first recommended product to cart
    Then the cart should contain 1 item

    # Browse category in Japanese
    When the user clicks the "電子機器" category tab
    And the user adds the first product in the list to cart
    Then the cart should contain 2 items

    # Checkout in Japanese
    When the user clicks the checkout button
    And the user fills in the shipping information:
      | field       | value                    |
      | name        | 山田太郎                 |
      | email       | yamada@example.com       |
      | phone       | 090-1234-5678           |
      | postalCode  | 100-0001                |
      | address     | 東京都千代田区1-1       |
    And the user clicks next on shipping step
    And the user selects "credit_card" as payment method
    And the user clicks next on payment step
    And the user confirms the order
    Then the order complete screen is displayed

  @workflow @multi-order
  Scenario: Place multiple orders and verify history
    Given the user is logged in as "demo"
    And the language is set to English

    # First order
    When the user adds the first recommended product to cart
    And the user clicks the checkout button
    And the user fills in valid shipping information
    And the user clicks next on shipping step
    And the user selects "credit_card" as payment method
    And the user clicks next on payment step
    And the user confirms the order
    Then the order complete screen is displayed
    When the user closes the checkout modal

    # Second order
    When the user clicks the "Home" category tab
    And the user adds the first product in the list to cart
    And the user clicks the checkout button
    And the user fills in valid shipping information
    And the user clicks next on shipping step
    And the user selects "bank_transfer" as payment method
    And the user clicks next on payment step
    And the user confirms the order
    Then the order complete screen is displayed
    When the user closes the checkout modal

    # Verify both orders in history
    When the user clicks view order history button
    Then the order history modal is displayed
    And there should be at least 2 orders in history
