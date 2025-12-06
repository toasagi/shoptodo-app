Feature: Product Search, Filter, and Sort
  As a user browsing the product catalog
  I want to search, filter, and sort products
  So that I can find items quickly and efficiently

  Background:
    Given the application is available
    And the user is logged in as "demo"
    And the language is set to English

  @smoke @search
  Scenario: Search for a product by name
    When the user searches for "スマートフォン"
    Then the search results should contain "スマートフォン"

  @smoke @search @filter
  Scenario: Filter products by category
    When the user filters by category "electronics"
    Then only products in "electronics" category should be displayed

  @smoke @sort
  Scenario: Sort products by price ascending
    When the user sorts products by price "asc"
    Then products should be displayed in ascending price order
