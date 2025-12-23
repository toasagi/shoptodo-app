Feature: Navigation Bar
  As a user
  I want to use the navigation bar
  So that I can easily navigate through the application

  Background:
    Given the application is available

  @smoke @navigation
  Scenario: Navigation bar shows only public links when not logged in
    Given the user is logged out
    Then the navigation should show "ホーム" link
    And the navigation should show "商品一覧" link
    And the navigation should not show "カート" link
    And the navigation should not show "注文履歴" link
    And the navigation should not show "Todo" link
    And the navigation should not show "プロフィール" link

  @smoke @navigation
  Scenario: Navigation bar shows all links when logged in
    Given the user is logged in as "demo"
    Then the navigation should show "ホーム" link
    And the navigation should show "商品一覧" link
    And the navigation should show "カート" link
    And the navigation should show "注文履歴" link
    And the navigation should show "Todo" link
    And the navigation should show "プロフィール" link

  @navigation
  Scenario: Navigation links hide after logout
    Given the user is logged in as "demo"
    When the user clicks the logout button
    Then the navigation should not show "カート" link
    And the navigation should not show "注文履歴" link
    And the navigation should not show "Todo" link
    And the navigation should not show "プロフィール" link

  @navigation
  Scenario: Products link scrolls to catalog section
    Given the user is logged in as "demo"
    When the user clicks the "商品一覧" navigation link
    Then the catalog section should be visible

  @navigation
  Scenario: Order history link opens order history modal
    Given the user is logged in as "demo"
    When the user clicks the "注文履歴" navigation link
    Then the order history modal should be visible

  @navigation
  Scenario: Navigation shows English labels after language switch
    Given the user is logged in as "demo"
    When the user switches language to English
    Then the navigation should show "Home" link
    And the navigation should show "Products" link
    And the navigation should show "Cart" link
    And the navigation should show "Orders" link
