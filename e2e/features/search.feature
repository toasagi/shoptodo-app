Feature: Product Search, Filter, and Sort
  As a user browsing the product catalog
  I want to search, filter, and sort products
  So that I can find items quickly and efficiently

  Background:
    Given the application is available
    And the user is logged in as "demo"
    And the language is set to English

  @smoke @search
  Scenario: Search for a product by Japanese name
    When the user searches for "スマートフォン"
    Then the search results should contain "Smartphone"

  @smoke @search
  Scenario: Search for a product by English name
    When the user searches for "Jeans"
    Then the search results should contain "Jeans"

  @smoke @search @filter
  Scenario: Filter products by category
    When the user filters by category "electronics"
    Then only products in "electronics" category should be displayed

  @smoke @sort
  Scenario: Sort products by price ascending
    When the user sorts products by price "asc"
    Then products should be displayed in ascending price order

  # ============================================
  # Japanese UI Test Scenarios (Issue #27)
  # ============================================

  @i18n @search @japanese-ui
  Scenario: Search in Japanese UI with English product name
    Given the language is set to Japanese
    When the user searches for "Laptop"
    Then the search results should contain "ノートパソコン"
    And the UI labels should be in Japanese

  @i18n @search @japanese-ui
  Scenario: Search in Japanese UI with Japanese product name
    Given the language is set to Japanese
    When the user searches for "スマートフォン"
    Then the search results should contain "スマートフォン"

  @i18n @filter @japanese-ui
  Scenario: Filter products by category in Japanese UI
    Given the language is set to Japanese
    When the user filters by category "electronics"
    Then only products in "electronics" category should be displayed
    And the product names should be displayed in Japanese

  @i18n @sort @japanese-ui
  Scenario: Sort products by price in Japanese UI
    Given the language is set to Japanese
    When the user sorts products by price "asc"
    Then products should be displayed in ascending price order
    And the product names should be displayed in Japanese
