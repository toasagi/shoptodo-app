# Data Persistence Feature
# Maps to: TS-PERSIST-001 to TS-PERSIST-002
# Test Cases: TC-PERSIST-001 to TC-PERSIST-008
# Requirements: REQ-F-011, REQ-NF-005 (Data Persistence, Browser Compatibility)
# User Stories: US-015, US-016

@data-persistence @regression
Feature: Data Persistence and Browser Compatibility
  As a general user
  I want my application state to be saved and restored
  So that I can continue where I left off

  Background:
    Given the user starts with a clean application state
    And localStorage is available

  @smoke @priority-high
  Scenario: TC-PERSIST-001 - Login state persistence
    Given the user is not logged in
    When the user logs in as "demo"
    And the user reloads the page
    Then the login state should be restored
    And the authentication information should be preserved in localStorage
    And the dashboard page should be displayed automatically

  @smoke @priority-high
  Scenario: TC-PERSIST-002 - Shopping cart data persistence
    Given the user is logged in
    When the user adds multiple products to the cart:
      | Product | Quantity |
      | スマートフォン | 2 |
      | ノートパソコン | 1 |
    And the user reloads the page
    Then the cart contents should be completely restored:
      | Product | Quantity |
      | スマートフォン | 2 |
      | ノートパソコン | 1 |
    And the cart item count should be accurate
    And the total amount should be calculated correctly

  @priority-medium
  Scenario: TC-PERSIST-003 - Todo list data persistence
    Given the user is logged in
    When the user adds multiple todo items:
      | Todo Text | Status |
      | ワイヤレスイヤホンを検討 | uncompleted |
      | スニーカーの価格調査 | completed |
    And the user reloads the page
    Then all todo items should be restored:
      | Todo Text | Status |
      | ワイヤレスイヤホンを検討 | uncompleted |
      | スニーカーの価格調査 | completed |
    And the completion states should be accurate
    And the item order should be preserved

  @priority-medium
  Scenario: TC-PERSIST-004 - Language setting persistence
    Given the application is in Japanese
    When the user switches to English
    And the user reloads the page
    Then the application should remain in English
    And all UI elements should be in English
    And the "EN" button should be active

  @comprehensive @priority-high
  Scenario: TC-PERSIST-005 - Complete application state persistence
    Given the user starts with a clean state
    When the user performs the following actions:
      | Action | Details |
      | Login | username: demo, password: password |
      | Language Switch | to English |
      | Add to Cart | Smartphone × 2, Laptop × 1 |
      | Add Todo | "Consider wireless earphones" (completed) |
      | Add Todo | "Check sneaker prices" (uncompleted) |
    And the browser is completely closed and reopened
    And the user navigates to the application URL
    Then all states should be restored correctly:
      | State Type | Expected |
      | Login | Logged in as demo |
      | Language | English |
      | Cart | Smartphone × 2, Laptop × 1 |
      | Todo | "Consider wireless earphones" (completed) |
      | Todo | "Check sneaker prices" (uncompleted) |

  @boundary @priority-low
  Scenario: TC-PERSIST-006 - localStorage capacity handling
    Given the user is logged in
    When the user adds a large amount of todo items (100+ items)
    And various cart operations are performed
    Then the application should handle localStorage capacity appropriately
    And if capacity limits are reached, appropriate error handling should occur
    And critical data (login state) should be prioritized for storage

  @edge-case @priority-low
  Scenario: TC-PERSIST-007 - Private browsing mode handling
    Given the browser is in private/incognito mode
    When the user uses the application normally:
      | Login | Add products to cart | Add todo items |
    And the user reloads the page
    Then the application should work without localStorage
    And data should be maintained during the session
    And appropriate warning messages should be displayed (optional)

  @error-handling @priority-low
  Scenario: TC-PERSIST-008 - Corrupted localStorage data handling
    Given the user has been using the application normally
    When localStorage contains corrupted JSON data (simulated)
    And the user reloads the application
    Then the application should not crash
    And corrupted data should be detected and cleared
    And the application should start with a clean initial state
    And normal functionality should be available

  @browser-compatibility @priority-medium
  Scenario Outline: TC-BROWSER-001, TC-BROWSER-002, TC-BROWSER-003 - Cross-browser persistence
    Given the user is using "<browser>"
    When the user performs normal application operations:
      | Login | Cart operations | Todo operations | Language switching |
    And the browser is restarted
    Then all data should be properly persisted and restored
    And localStorage functionality should work correctly
    And no browser-specific issues should occur

    Examples:
      | browser |
      | Chrome |
      | Firefox |
      | Safari |

  @data-integrity @priority-medium
  Scenario: Data synchronization across multiple tabs
    Given the user has the application open in Tab 1
    And the user opens the application in Tab 2
    When the user adds items to cart in Tab 1
    And the user switches to Tab 2
    Then the cart changes should be reflected in Tab 2
    And both tabs should show consistent data
    And localStorage events should synchronize properly

  @migration @priority-low
  Scenario: Data format migration handling
    Given the user has data stored in an older format
    When the application loads with new data format requirements
    Then the old data should be migrated automatically
    And no data loss should occur
    And the application should function normally with migrated data

  @cleanup @priority-low
  Scenario: Data cleanup and maintenance
    Given the user has been using the application for extended periods
    When excessive data accumulates in localStorage
    Then appropriate cleanup mechanisms should be available
    And old or unnecessary data should be removed
    And performance should be maintained

  @security @priority-medium
  Scenario: Data security in localStorage
    Given the user has sensitive information in the application
    When data is stored in localStorage
    Then passwords should not be stored in plain text
    And sensitive information should be appropriately protected
    And data should be stored with minimal security risks