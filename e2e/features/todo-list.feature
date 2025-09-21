# Todo List Feature
# Maps to: TS-TODO-001 to TS-TODO-003
# Test Cases: TC-TODO-001 to TC-TODO-008
# Requirements: REQ-F-009 (Todo List)
# User Stories: US-011, US-012

@todo-list @smoke @regression
Feature: Todo List for Favorite Products
  As a general user
  I want to manage my favorite product memos
  So that I can keep track of products I'm interested in

  Background:
    Given the user is logged in as "demo"
    And the user is on the dashboard page
    And the todo list is visible

  @smoke @priority-high
  Scenario: TC-TODO-001 - Add new todo item
    Given the todo list is empty
    When the user enters "ワイヤレスイヤホンを検討" in the todo text box
    And the user clicks the "追加" button
    Then the new todo item should be added to the list
    And the item should be in uncompleted state
    And the text box should be cleared
    And the todo data should be saved in localStorage

  @validation @priority-low
  Scenario: TC-TODO-002 - Attempt to add empty todo
    Given the todo list is visible
    When the user leaves the todo text box empty
    And the user clicks the "追加" button
    Then a validation error "テキストを入力してください" should be displayed
    And no todo item should be added

  @boundary @priority-low
  Scenario: TC-TODO-003 - Add long text todo item
    Given the todo list is visible
    When the user enters a 100-character text in the todo text box
    And the user clicks the "追加" button
    Then the todo item should be added successfully
    And the long text should be displayed properly with text wrapping
    And no performance degradation should occur

  @security @priority-low
  Scenario: TC-TODO-004 - XSS prevention in todo text
    Given the todo list is visible
    When the user enters "<script>alert('XSS')</script>" in the todo text box
    And the user clicks the "追加" button
    Then the script should not be executed
    And the text should be displayed as plain text
    And no XSS alert should appear

  @smoke @priority-high
  Scenario: TC-TODO-005 - Mark todo item as completed
    Given the todo list contains "ワイヤレスイヤホンを検討" in uncompleted state
    When the user clicks the checkbox for "ワイヤレスイヤホンを検討"
    Then the item should be marked as completed
    And a strikethrough should be applied to the text
    And a checkmark should appear in the checkbox
    And the localStorage should be updated

  @priority-medium
  Scenario: TC-TODO-006 - Mark completed item as uncompleted
    Given the todo list contains "ワイヤレスイヤホンを検討" in completed state
    When the user clicks the checkbox for "ワイヤレスイヤホンを検討"
    Then the item should be marked as uncompleted
    And the strikethrough should be removed from the text
    And the checkbox should be unchecked

  @priority-medium
  Scenario: TC-TODO-007 - Delete todo item
    Given the todo list contains multiple items:
      | ワイヤレスイヤホンを検討 |
      | スニーカーの価格調査 |
    When the user clicks the delete button for "ワイヤレスイヤホンを検討"
    Then "ワイヤレスイヤホンを検討" should be removed from the list
    And "スニーカーの価格調査" should remain in the list
    And the item should be removed from localStorage

  @complex @priority-low
  Scenario: TC-TODO-008 - Multiple todo operations
    Given the todo list is empty
    When the user adds "商品A" to the todo list
    And the user adds "商品B" to the todo list
    And the user adds "商品C" to the todo list
    And the user marks "商品A" as completed
    And the user deletes "商品B"
    Then the todo list should contain:
      | 商品A | completed |
      | 商品C | uncompleted |
    And data integrity should be maintained
    And localStorage should reflect all changes

  @data-persistence @priority-medium
  Scenario: Todo data persistence across page reloads
    Given the todo list contains "重要なタスク" in uncompleted state
    When the user reloads the page
    Then the todo item should be restored
    And the completion state should be maintained
    And the todo functionality should work normally

  @data-persistence @priority-medium
  Scenario: Todo data persistence across browser sessions
    Given the todo list contains multiple items with mixed completion states
    When the browser is closed and reopened
    And the user navigates to the application
    Then all todo items should be restored
    And all completion states should be maintained
    And new todo operations should work normally

  @integration @priority-medium
  Scenario: Todo integration with product browsing
    Given the user is browsing products
    When the user finds an interesting product "ワイヤレスイヤホン"
    And the user adds a related todo "ワイヤレスイヤホンのレビューを確認"
    Then the todo should be added successfully
    And the user can continue browsing products
    And the todo should remain visible on the dashboard

  @usability @priority-low
  Scenario: Todo list user experience
    Given the todo list contains several items
    When the user interacts with various todo operations
    Then all operations should provide immediate visual feedback
    And the interface should remain responsive
    And no unexpected behavior should occur