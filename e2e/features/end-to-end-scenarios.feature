# End-to-End User Journey Scenarios
# Maps to: TS-INTEGRATION-001, TS-INTEGRATION-002
# Test Cases: Integration scenarios covering complete user workflows
# Requirements: All functional requirements REQ-F-001 to REQ-F-011
# User Stories: Complete user journeys across multiple features

@end-to-end @integration @smoke @regression
Feature: Complete User Journey Scenarios
  As a new user
  I want to experience the complete application workflow
  So that I can accomplish realistic shopping and learning tasks

  @comprehensive @priority-high
  Scenario: TS-INTEGRATION-001 - Complete new user shopping flow
    Given a new user accesses the application for the first time

    # Language Selection and Login
    When the user switches to English for better accessibility
    Then all UI elements should be displayed in English

    When the user logs in with credentials "demo" and "password"
    Then the user should successfully access the dashboard
    And the username "demo" should be displayed in the header

    # Product Discovery and Search
    When the user searches for "Smart" in the search box
    And the user applies the "electronics" category filter
    Then only "Smartphone" should be displayed in the results
    And the search and filter should work together correctly

    # Shopping Cart Operations
    When the user adds "Smartphone" to the cart 2 times
    And the user adds "Laptop" to the cart 1 time
    Then the cart should contain:
      | Product | Quantity |
      | Smartphone | 2 |
      | Laptop | 1 |
    And the cart item count should show "3"

    # Todo List Management
    When the user adds "Consider wireless earphones" to the todo list
    Then the todo item should be visible in the todo section
    And the item should be in uncompleted state

    # Cart Management and Checkout
    When the user navigates to the cart page
    And the user completes the checkout process
    Then the purchase should be completed successfully
    And the cart should be emptied
    And the purchase history should be recorded

    # State Persistence Verification
    When the user reloads the page
    Then the login state should be maintained
    And the language setting (English) should be preserved
    And the todo list should be maintained
    And the purchase history should be available

  @data-consistency @priority-medium
  Scenario: TS-INTEGRATION-002 - Multiple operations data consistency
    Given the user is logged in as "demo"

    # Parallel Operations Simulation
    When the user performs the following operations in sequence:
      | Step | Operation | Details |
      | 1 | Add Product A to cart | スマートフォン |
      | 2 | Switch language | to English |
      | 3 | Add Product B to cart | Laptop |
      | 4 | Add Todo item 1 | "item1" |
      | 5 | Change Product A quantity | to 3 |
      | 6 | Mark Todo item 1 as completed | completed state |

    Then all operations should complete successfully
    And the cart should contain:
      | Product | Quantity |
      | Smartphone | 3 |
      | Laptop | 1 |
    And the todo list should contain:
      | Item | Status |
      | item1 | completed |
    And the language should be English
    And all data should be accurately saved in localStorage

  @user-experience @priority-medium
  Scenario: Realistic daily usage pattern
    Given the user is a returning customer
    And the user has previous session data

    # Daily Session Start
    When the user opens the application
    Then the previous session should be restored automatically
    And the user should see their previous cart contents
    And the language preference should be restored

    # Product Research and Comparison
    When the user browses different product categories:
      | Category | Action |
      | Electronics | Compare smartphones and laptops |
      | Clothing | Check t-shirt and jeans prices |
      | Books | Look for programming guides |
    And the user uses various filters and sorts
    Then all product operations should work smoothly
    And the user should be able to compare products effectively

    # Wishlist Management via Todo
    When the user adds multiple products to their wishlist:
      | Product | Priority |
      | Wireless Earphones | High |
      | Programming Book | Medium |
      | Sneakers | Low |
    Then all wishlist items should be tracked properly
    And the user should be able to manage priorities

    # Purchase Decision Process
    When the user moves selected wishlist items to cart
    And the user adjusts quantities based on budget
    And the user proceeds with checkout
    Then the purchase process should be intuitive
    And the wishlist should be updated accordingly

  @cross-feature @priority-medium
  Scenario: Cross-feature interaction testing
    Given the user is actively using multiple features

    # Feature Integration Testing
    When the user performs overlapping operations:
      | Feature Combination | Test Scenario |
      | Search + Language | Search in Japanese, switch to English, search in English |
      | Cart + Todo | Add to cart, add related todo, manage both |
      | Filter + Sort + Search | Apply multiple criteria simultaneously |
      | Persistence + All Features | Use all features, reload, verify restoration |

    Then each feature should work correctly
    And features should not interfere with each other
    And data consistency should be maintained across features

  @error-recovery @priority-low
  Scenario: Error recovery and resilience
    Given the user is in the middle of multiple operations

    # Simulated Error Scenarios
    When various error conditions occur:
      | Error Type | Recovery Expected |
      | Network interruption | Graceful degradation |
      | localStorage full | Appropriate handling |
      | Invalid data input | User-friendly errors |
      | Browser compatibility | Fallback mechanisms |

    Then the application should recover gracefully
    And user data should be preserved where possible
    And clear error messages should guide the user

  @performance @priority-low
  Scenario: Application performance under normal usage
    Given the user is performing typical operations

    When the user executes common workflows:
      | Workflow | Performance Criteria |
      | Login | < 2 seconds |
      | Product browsing | Smooth scrolling and filtering |
      | Cart operations | Immediate feedback |
      | Language switching | < 1 second transition |
      | Todo management | Real-time updates |

    Then all operations should meet performance criteria
    And the user experience should remain smooth
    And no significant delays should occur

  @accessibility @priority-low
  Scenario: Complete workflow accessibility
    Given the user has accessibility requirements

    When the user navigates through the complete application:
      | Accessibility Feature | Requirement |
      | Keyboard navigation | All features accessible via keyboard |
      | Screen reader | Proper labels and descriptions |
      | Color contrast | Sufficient contrast ratios |
      | Focus management | Clear focus indicators |

    Then the application should be fully accessible
    And users with disabilities should be able to complete all tasks
    And accessibility standards should be met

  @mobile-responsive @priority-low
  Scenario: Mobile device complete workflow
    Given the user is accessing the application on a mobile device

    When the user performs the complete shopping workflow on mobile:
      | Mobile Feature | Expectation |
      | Touch interface | Responsive touch targets |
      | Screen adaptation | Proper layout on small screens |
      | Portrait/landscape | Functionality in both orientations |
      | Mobile performance | Optimized for mobile devices |

    Then the mobile experience should be fully functional
    And all features should work properly on mobile
    And the responsive design should adapt appropriately

  @security @priority-medium
  Scenario: Security considerations in complete workflow
    Given the user is concerned about security

    When the user uses the application normally
    Then no sensitive information should be exposed
    And XSS attacks should be prevented in all input fields
    And localStorage should not contain sensitive data in plain text
    And the application should follow security best practices

  @learning-objectives @priority-high
  Scenario: E2E testing learning objectives verification
    Given this application is used for testing education

    When students perform comprehensive testing:
      | Learning Goal | Testing Technique Demonstrated |
      | Test Design | Equivalence partitioning, boundary analysis |
      | Test Automation | Page Object Model, Cucumber BDD |
      | Integration | Cross-feature testing |
      | Data Management | Persistence and state testing |
      | User Experience | End-to-end scenarios |

    Then all major testing techniques should be demonstrable
    And students should gain practical E2E testing experience
    And real-world testing scenarios should be covered