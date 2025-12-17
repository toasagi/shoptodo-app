Feature: Category Tab Navigation
  As a user browsing the product catalog
  I want to navigate products by category tabs
  So that I can easily find products in specific categories

  Background:
    Given the application is available
    And the user is logged in as "demo"
    And the language is set to English

  @smoke @category-tabs
  Scenario: All category tabs are displayed
    Then the category tabs should be visible
    And the following category tabs should be present:
      | tab         |
      | All Products|
      | Electronics |
      | Clothing    |
      | Books       |
      | Home        |

  @smoke @category-tabs
  Scenario: Default tab is "All Products"
    Then the "All Products" tab should be active
    And all products should be displayed

  @smoke @category-tabs
  Scenario: Click Electronics tab filters products
    When the user clicks the "Electronics" category tab
    Then the "Electronics" tab should be active
    And only products in "electronics" category should be displayed

  @category-tabs
  Scenario: Click Clothing tab filters products
    When the user clicks the "Clothing" category tab
    Then the "Clothing" tab should be active
    And only products in "clothing" category should be displayed

  @category-tabs
  Scenario: Click Books tab filters products
    When the user clicks the "Books" category tab
    Then the "Books" tab should be active
    And only products in "books" category should be displayed

  @category-tabs
  Scenario: Click Home tab filters products
    When the user clicks the "Home" category tab
    Then the "Home" tab should be active
    And only products in "home" category should be displayed

  @category-tabs
  Scenario: Return to All Products from category
    Given the user has clicked the "Electronics" category tab
    When the user clicks the "All Products" category tab
    Then the "All Products" tab should be active
    And all products should be displayed

  @category-tabs @search
  Scenario: Search works within selected category
    Given the user has clicked the "Electronics" category tab
    When the user searches for "スマート"
    Then only products matching "スマート" in "electronics" category should be displayed

  @category-tabs @sort
  Scenario: Sort works within selected category
    Given the user has clicked the "Books" category tab
    When the user sorts products by price "asc"
    Then products should be displayed in ascending price order
    And only products in "books" category should be displayed

  # ============================================
  # Japanese UI Test Scenarios
  # ============================================

  @i18n @category-tabs @japanese-ui
  Scenario: Category tabs display in Japanese
    Given the language is set to Japanese
    Then the following category tabs should be present:
      | tab         |
      | すべて      |
      | 電子機器    |
      | 衣類        |
      | 書籍        |
      | ホーム      |

  @i18n @category-tabs @language-switch
  Scenario: Category tabs update after language switch
    Given the "Electronics" tab should be active
    When the user switches language to Japanese
    Then the "電子機器" tab should be active
    And only products in "electronics" category should be displayed
    And the product names should be displayed in Japanese
