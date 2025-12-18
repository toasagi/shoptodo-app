Feature: Recommended Products Display
  As a user visiting the ShopTodo application
  I want to see recommended products from each category
  So that I can quickly discover popular items

  Background:
    Given the application is available

  @smoke @recommended
  Scenario: Recommended section displays 4 products
    Then the recommended section should be visible
    And the recommended section should contain 4 products

  @smoke @recommended
  Scenario: Recommended products come from different categories
    Then the recommended section should contain products from all categories:
      | category    |
      | electronics |
      | clothing    |
      | books       |
      | home        |

  @recommended @cart
  Scenario: Add recommended product to cart when logged in
    Given the user is logged in as "demo"
    When the user adds the first recommended product to cart
    Then the cart should contain 1 item
    And a success message should be displayed

  @recommended @cart @negative
  Scenario: Cannot add recommended product to cart when not logged in
    Then the recommended add to cart buttons should be disabled
    And the cart should remain empty

  # ============================================
  # Japanese UI Test Scenarios
  # ============================================

  @i18n @recommended @japanese-ui
  Scenario: Recommended section displays in Japanese
    Given the language is set to Japanese
    Then the recommended section title should be "おすすめ商品"
    And the recommended product names should be in Japanese

  @i18n @recommended @language-switch
  Scenario: Recommended product names update after language switch
    Given the language is set to English
    Then the recommended section title should be "Recommended"
    When the user switches language to Japanese
    Then the recommended section title should be "おすすめ商品"
    And the recommended product names should be in Japanese
