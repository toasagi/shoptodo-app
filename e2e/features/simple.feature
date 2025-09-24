Feature: Simple Connection Test
  As a test
  I want to verify basic browser functionality
  So that I can ensure the setup works

  @debug
  Scenario: Basic page access
    Given the application is available
    When the user navigates to the application
    Then the page should load successfully