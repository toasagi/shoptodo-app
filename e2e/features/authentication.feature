# Authentication Feature
# Maps to: TS-AUTH-001 to TS-AUTH-005
# Test Cases: TC-AUTH-001 to TC-AUTH-009
# Requirements: REQ-F-001 (User Authentication)
# User Stories: US-001, US-002, US-003

@authentication @smoke @regression
Feature: User Authentication
  As a test learner
  I want to be able to log in and out of the application
  So that I can learn authentication testing techniques

  Background:
    Given the user is on the login page
    And the application is in initial state

  @smoke @priority-high
  Scenario: TC-AUTH-001 - Successful login with valid credentials
    Given the login modal is displayed
    When the user enters username "demo"
    And the user enters password "password"
    And the user clicks the login button
    Then the user should be logged in successfully
    And the dashboard page should be displayed
    And the username "demo" should be displayed in the header
    And the login state should be saved in localStorage

  @priority-high
  Scenario: TC-AUTH-002 - Login failure with invalid username
    Given the login modal is displayed
    When the user enters username "invalid"
    And the user enters password "password"
    And the user clicks the login button
    Then an error message "無効な認証情報です" should be displayed
    And the user should remain on the login page
    And no login information should be saved in localStorage

  @priority-high
  Scenario: TC-AUTH-003 - Login failure with invalid password
    Given the login modal is displayed
    When the user enters username "demo"
    And the user enters password "wrongpass"
    And the user clicks the login button
    Then an error message "無効な認証情報です" should be displayed
    And the user should remain on the login page
    And no login information should be saved in localStorage

  @priority-medium
  Scenario Outline: TC-AUTH-004, TC-AUTH-005, TC-AUTH-006 - Login validation with empty fields
    Given the login modal is displayed
    When the user enters username "<username>"
    And the user enters password "<password>"
    And the user clicks the login button
    Then a validation error "<error_message>" should be displayed
    And the login process should not execute

    Examples:
      | username | password | error_message                      |
      |          | password | ユーザー名を入力してください            |
      | demo     |          | パスワードを入力してください           |
      |          |          | ユーザー名とパスワードを入力してください |

  @smoke @priority-high
  Scenario: TC-AUTH-007 - Successful logout
    Given the user is logged in as "demo"
    And the user is on the dashboard page
    When the user clicks the logout button
    Then the user should be logged out successfully
    And the login page should be displayed
    And the login information should be removed from localStorage
    And the username should not be displayed in the header

  @persistence @priority-high
  Scenario: TC-AUTH-008 - Login state persistence after page reload
    Given the user is logged in as "demo"
    And the user is on the dashboard page
    When the user reloads the page
    Then the login state should be maintained
    And the dashboard page should be displayed
    And the username "demo" should be displayed in the header

  @persistence @priority-medium
  Scenario: TC-AUTH-009 - Login state persistence after browser restart
    Given the user is logged in as "demo"
    And the user is on the dashboard page
    When the browser is restarted
    And the user navigates to the application URL
    Then the login state should be restored
    And the dashboard page should be displayed
    And the username "demo" should be displayed in the header

  @security @priority-medium
  Scenario: XSS prevention in login fields
    Given the login modal is displayed
    When the user enters username "<script>alert('XSS')</script>"
    And the user enters password "password"
    And the user clicks the login button
    Then the script should not be executed
    And an appropriate error message should be displayed
    And the application should remain secure