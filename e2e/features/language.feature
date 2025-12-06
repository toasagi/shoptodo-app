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
