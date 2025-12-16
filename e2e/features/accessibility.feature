Feature: Accessibility (a11y) Testing
  As a user with accessibility needs
  I want the application to be accessible
  So that I can use it with assistive technologies

  Background:
    Given the application is available

  @a11y @smoke
  Scenario: Home page should have no critical accessibility violations
    When the user is on the home page
    Then the page should have no critical accessibility violations

  @a11y @smoke
  Scenario: Login modal should be accessible
    Given the user is logged out
    When the user opens the login modal
    Then the modal should have no critical accessibility violations
    And the modal should have proper ARIA attributes

  @a11y
  Scenario: Product catalog should be accessible
    Given the user is logged in as "demo"
    When the user views the product catalog
    Then the product list should have no critical accessibility violations

  @a11y
  Scenario: Checkout modal should be accessible
    Given the user is logged in as "demo"
    And the user has items in the cart
    When the user opens the checkout modal
    Then the modal should have no critical accessibility violations
    And the checkout form should have proper labels

  @a11y
  Scenario: Skip link should be functional
    When the user presses Tab key
    Then the skip link should be visible
    And the skip link should navigate to main content
