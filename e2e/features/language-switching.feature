# Language Switching Feature
# Maps to: TS-LANG-001 to TS-LANG-003
# Test Cases: TC-LANG-001 to TC-LANG-008
# Requirements: REQ-F-010 (Multi-language Support)
# User Stories: US-013, US-014

@language-switching @smoke @regression
Feature: Multi-language Support
  As an international user
  I want to switch between Japanese and English languages
  So that I can use the application in my preferred language

  Background:
    Given the user is logged in as "demo"
    And the user is on the dashboard page

  @smoke @priority-high
  Scenario: TC-LANG-001 - Switch from Japanese to English
    Given the application is displayed in Japanese
    And the header shows "JP" and "EN" buttons
    When the user clicks the "EN" button
    Then all UI elements should be displayed in English
    And product names should be displayed in English
    And the "EN" button should be in active state
    And the language setting should be saved in localStorage

  @smoke @priority-high
  Scenario: TC-LANG-002 - Switch from English to Japanese
    Given the application is displayed in English
    When the user clicks the "JP" button
    Then all UI elements should be displayed in Japanese
    And product names should be displayed in Japanese
    And the "JP" button should be in active state
    And the language setting should be saved in localStorage

  @persistence @priority-high
  Scenario: TC-LANG-003 - Language setting persistence after page reload
    Given the application is displayed in English
    When the user reloads the page
    Then the application should remain in English
    And product names should remain in English
    And the "EN" button should remain in active state

  @data-integrity @priority-medium
  Scenario: TC-LANG-004 - UI elements translation verification
    Given the application is displayed in Japanese
    When the user switches to English
    Then all the following elements should be translated:
      | Element Type | Japanese | English |
      | Header | ヘッダー | Header |
      | Navigation | ナビゲーション | Navigation |
      | Buttons | ボタン | Buttons |
      | Form Labels | フォームラベル | Form Labels |
      | Messages | メッセージ | Messages |
      | Error Messages | エラーメッセージ | Error Messages |
    And no untranslated items should exist

  @data-integrity @priority-medium
  Scenario: TC-LANG-005 - Product names translation verification
    Given the user is on the product catalog
    When the user switches between languages
    Then product names should be correctly translated:
      | Japanese | English |
      | スマートフォン | Smartphone |
      | ノートパソコン | Laptop |
      | Tシャツ | T-shirt |
      | ジーンズ | Jeans |
      | プログラミング入門書 | Programming Basics |
      | JavaScript完全ガイド | JavaScript Complete Guide |
    And all products should have translations in both languages

  @boundary @priority-low
  Scenario: TC-LANG-006 - Dynamic content language handling
    Given the todo list contains Japanese text "日本語のタスク"
    When the user switches to English
    Then the todo item text should remain as "日本語のタスク"
    And only UI elements should be translated to English
    And user input data should be language-independent

  @integration @priority-low
  Scenario: TC-LANG-007 - Search functionality with language switching
    Given the application is in Japanese
    And the user has searched for "スマート"
    When the user switches to English
    And the user searches for "Smart"
    Then the English product names should be searched
    And the search results should display correctly
    And the search history should be cleared appropriately

  @integration @priority-low
  Scenario: TC-LANG-008 - Shopping cart with language switching
    Given the cart contains products
    And the application is in Japanese
    When the user switches to English
    And the user views the cart page
    Then cart product names should be displayed in English
    And cart functionality should work normally
    And price formatting should be appropriate for the language

  @data-persistence @priority-medium
  Scenario: Language preference persistence across browser sessions
    Given the user has set the language to English
    When the browser is closed and reopened
    And the user navigates to the application
    Then the application should start in English
    And all content should be displayed in English
    And the "EN" button should be active

  @visual @priority-low
  Scenario: Language switching visual feedback
    Given the application is displayed in Japanese
    When the user hovers over the "EN" button
    Then appropriate hover effects should be shown
    When the user clicks the "EN" button
    Then immediate visual feedback should be provided
    And the language switch should be smooth without flicker

  @comprehensive @priority-medium
  Scenario: Complete language switching flow
    Given the user starts with Japanese language
    When the user performs the following actions in sequence:
      | Action | Expected Language |
      | Browse products | Japanese |
      | Add items to cart | Japanese |
      | Switch to English | English |
      | View cart | English |
      | Add todo items | English (UI only) |
      | Reload page | English |
      | Switch back to Japanese | Japanese |
    Then each step should display content in the correct language
    And all functionality should work properly in both languages
    And data integrity should be maintained throughout

  @error-handling @priority-low
  Scenario: Language switching error handling
    Given the application is running normally
    When a language switching error occurs (simulated)
    Then the application should fallback to the previous language
    And an appropriate error message should be displayed
    And the user should be able to retry the language switch