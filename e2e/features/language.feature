Feature: Language Switching (Internationalization)
  As a multilingual user
  I want to switch between English and Japanese
  So that I can use the application in my preferred language

  Background:
    Given the application is available
    And the user is logged in as "demo"

  @smoke @i18n
  Scenario: Switch language to Japanese
    Given the language is set to English
    When the user switches language to Japanese
    Then the UI should display in Japanese
    And the logout button text should be in Japanese

  @smoke @i18n
  Scenario: Switch language to English
    Given the language is set to Japanese
    When the user switches language to English
    Then the UI should display in English
    And the logout button text should be "Logout"

  # ============================================
  # Language Persistence Test Scenarios (Issue #27)
  # ============================================

  @i18n @persistence
  Scenario: Language setting persists after page reload
    Given the language is set to Japanese
    When the page is reloaded
    Then the UI should display in Japanese
    And the logout button text should be in Japanese

  @i18n @persistence
  Scenario: Language setting persists after page reload to English
    Given the language is set to English
    When the page is reloaded
    Then the UI should display in English
    And the logout button text should be "Logout"

  # ============================================
  # New Products (ID 13-52) Test Scenarios (Issue #27)
  # ============================================

  @i18n @new-products
  Scenario: New electronics products display correctly in Japanese
    Given the language is set to Japanese
    When the user views the product catalog
    Then the product "タブレット" should be visible
    And the product "ドローン" should be visible
    And the product "スマートウォッチ" should be visible

  @i18n @new-products
  Scenario: New products display correctly in English
    Given the language is set to English
    When the user views the product catalog
    Then the product "Tablet" should be visible
    And the product "Drone" should be visible
    And the product "Smart Watch" should be visible

  @i18n @new-products
  Scenario: Book category products display in Japanese
    Given the language is set to Japanese
    When the user filters by category "books"
    Then the product "Python入門" should be visible
    And the product "Web開発の教科書" should be visible
