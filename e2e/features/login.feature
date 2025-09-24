Feature: User Login
  As a user
  I want to log into the ShopTodo application
  So that I can access the dashboard and manage my shopping and todos

  Background:
    Given the application is available
    And the user is on the login page
    And the language is set to English

  @smoke
  Scenario: Successful login with valid credentials
    When the user clicks the login button to open modal
    Then the login modal is displayed
    When the user enters username "demo"
    And the user enters password "password"
    And the user submits the login form
    Then the user should be logged in successfully
    And the dashboard should be displayed
    And the username "demo" should be displayed in the header

  @negative
  Scenario: Login failure with invalid username
    When the user clicks the login button to open modal
    Then the login modal is displayed
    When the user enters username "invalid"
    And the user enters password "password"
    And the user submits the login form
    Then an error message should be displayed
    And the user should remain on the login page

  @negative
  Scenario: Login failure with invalid password
    When the user clicks the login button to open modal
    Then the login modal is displayed
    When the user enters username "demo"
    And the user enters password "wrongpassword"
    And the user submits the login form
    Then an error message should be displayed
    And the user should remain on the login page

  @negative
  Scenario: Login failure with empty credentials
    When the user clicks the login button to open modal
    Then the login modal is displayed
    When the user enters username ""
    And the user enters password ""
    And the user submits the login form
    Then a validation error should be displayed
    And the user should remain on the login page

  @smoke
  Scenario: Successful logout
    Given the user is logged in as "demo"
    When the user clicks the logout button
    Then the user should be logged out successfully
    And the login modal should be displayed