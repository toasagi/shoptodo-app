# Product Catalog Feature
# Maps to: TS-CATALOG-001 to TS-CATALOG-008
# Test Cases: TC-CATALOG-001 to TC-CATALOG-019
# Requirements: REQ-F-002, REQ-F-003, REQ-F-004, REQ-F-005 (Product Catalog, Search, Filter, Sort)
# User Stories: US-004, US-005, US-006, US-007

@product-catalog @smoke @regression
Feature: Product Catalog Management
  As a general user
  I want to browse, search, filter, and sort products
  So that I can find products I want to purchase

  Background:
    Given the user is logged in as "demo"
    And the user is on the dashboard page

  @smoke @priority-high
  Scenario: TC-CATALOG-001 - Initial product catalog display
    Given the dashboard page is loaded
    Then 12 products should be displayed
    And each product should show name, price, and category
    And each product should have an "Add to Cart" button
    And product image placeholders should be displayed

  @priority-medium
  Scenario: TC-CATALOG-002 - Product data integrity verification
    Given the dashboard page is loaded
    Then the product "スマートフォン" should display price "89,800円" and category "electronics"
    And the product "ノートパソコン" should display price "129,800円" and category "electronics"
    And the product "Tシャツ" should display price "2,980円" and category "clothing"

  @search @priority-high
  Scenario: TC-CATALOG-003 - Product search with partial match (Japanese)
    Given the dashboard page is loaded
    When the user enters "スマート" in the search box
    Then only products containing "スマートフォン" should be displayed
    And the search result count should show "1件"
    And other products should not be visible

  @search @language @priority-medium
  Scenario: TC-CATALOG-004 - Product search with partial match (English)
    Given the language is set to English
    And the dashboard page is loaded
    When the user enters "Smart" in the search box
    Then only products containing "Smartphone" should be displayed
    And the search result count should show "1 item"
    And product names should be displayed in English

  @search @priority-medium
  Scenario: TC-CATALOG-005 - Complete product name search
    Given the dashboard page is loaded
    When the user enters "スマートフォン" in the search box
    Then only the "スマートフォン" product should be displayed
    And the search result count should show "1件"

  @search @priority-medium
  Scenario: TC-CATALOG-006 - Search with no results
    Given the dashboard page is loaded
    When the user enters "存在しない商品" in the search box
    Then no products should be displayed
    And a "検索結果が見つかりませんでした" message should be shown
    And the search result count should show "0件"

  @search @priority-low
  Scenario: TC-CATALOG-007 - Clear search to restore all products
    Given the user has searched for "スマート"
    And only 1 product is displayed
    When the user clears the search box
    Then all 12 products should be displayed again
    And the search result count should show "12件"

  @security @priority-low
  Scenario: TC-CATALOG-008 - XSS prevention in search
    Given the dashboard page is loaded
    When the user enters "<script>alert('XSS')</script>" in the search box
    Then the script should not be executed
    And the text should be treated as a normal search term
    And no XSS alert should appear

  @filter @priority-high
  Scenario: TC-CATALOG-009 - Single category filter - Electronics
    Given the dashboard page is loaded
    When the user selects the "electronics" category filter
    Then only electronics products should be displayed:
      | スマートフォン |
      | ノートパソコン |
      | ワイヤレスイヤホン |
    And other category products should not be visible
    And the "electronics" filter button should be active

  @filter @priority-medium
  Scenario: TC-CATALOG-010 - Single category filter - Clothing
    Given the dashboard page is loaded
    When the user selects the "clothing" category filter
    Then only clothing products should be displayed:
      | Tシャツ |
      | ジーンズ |
      | スニーカー |
    And other category products should not be visible

  @filter @priority-medium
  Scenario: TC-CATALOG-011 - Multiple category filter selection
    Given the dashboard page is loaded
    When the user selects the "electronics" category filter
    And the user also selects the "books" category filter
    Then electronics and books products should be displayed
    And clothing and home products should not be visible
    And both "electronics" and "books" filter buttons should be active

  @filter @priority-low
  Scenario: TC-CATALOG-012 - Clear all category filters
    Given the user has selected "electronics" category filter
    And only electronics products are displayed
    When the user clicks the "All" filter button
    Then all 12 products should be displayed
    And all category filter buttons should be inactive

  @sort @priority-medium
  Scenario: TC-CATALOG-013 - Sort products by name (ascending)
    Given the dashboard page is loaded
    When the user selects "名前（昇順）" from the sort dropdown
    Then products should be sorted by name in ascending order
    And the sort should follow Japanese alphabetical order

  @sort @priority-low
  Scenario: TC-CATALOG-014 - Sort products by name (descending)
    Given the dashboard page is loaded
    When the user selects "名前（降順）" from the sort dropdown
    Then products should be sorted by name in descending order

  @sort @priority-high
  Scenario: TC-CATALOG-015 - Sort products by price (ascending)
    Given the dashboard page is loaded
    When the user selects "価格（安い順）" from the sort dropdown
    Then products should be sorted by price in ascending order
    And the first product should be "Tシャツ (2,980円)"
    And the last product should be "ノートパソコン (129,800円)"

  @sort @priority-medium
  Scenario: TC-CATALOG-016 - Sort products by price (descending)
    Given the dashboard page is loaded
    When the user selects "価格（高い順）" from the sort dropdown
    Then products should be sorted by price in descending order
    And the first product should be "ノートパソコン (129,800円)"
    And the last product should be "Tシャツ (2,980円)"

  @complex @priority-medium
  Scenario: TC-CATALOG-017 - Combined search and category filter
    Given the dashboard page is loaded
    When the user enters "ノート" in the search box
    And the user selects the "electronics" category filter
    Then only "ノートパソコン" should be displayed
    And both search and filter should be applied with AND condition

  @complex @priority-low
  Scenario: TC-CATALOG-018 - Combined search and sort
    Given the dashboard page is loaded
    When the user enters "本" in the search box
    And the user selects "価格（安い順）" from the sort dropdown
    Then book products should be displayed in price ascending order:
      | プログラミング入門書 (3,200円) |
      | Web開発の教科書 (3,800円) |
      | JavaScript完全ガイド (4,800円) |

  @complex @priority-low
  Scenario: TC-CATALOG-019 - Combined filter and sort
    Given the dashboard page is loaded
    When the user selects the "clothing" category filter
    And the user selects "価格（高い順）" from the sort dropdown
    Then clothing products should be displayed in price descending order:
      | スニーカー (8,900円) |
      | ジーンズ (7,980円) |
      | Tシャツ (2,980円) |