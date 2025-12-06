Feature: Todo List Management
  As a logged-in user
  I want to manage my todo items
  So that I can keep track of my shopping tasks and notes

  Background:
    Given the application is available
    And the user is logged in as "demo"
    And the language is set to English
    And the todo list is empty

  @smoke @todo
  Scenario: Add a new todo item
    When the user enters todo text "Buy groceries"
    And the user clicks the add todo button
    Then the todo "Buy groceries" should appear in the list
    And the todo count should be 1

  @smoke @todo
  Scenario: Mark todo as complete
    Given the user has added todo "Complete shopping"
    When the user toggles completion for "Complete shopping"
    Then the todo "Complete shopping" should be marked as completed

  @smoke @todo
  Scenario: Delete a todo item
    Given the user has added todo "Item to delete"
    When the user deletes the todo "Item to delete"
    Then the todo "Item to delete" should not appear in the list
    And the todo count should be 0
