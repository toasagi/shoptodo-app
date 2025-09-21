/**
 * Page Object Model Index
 * Exports all page objects for easy import
 *
 * Architecture: Page Object Model (POM)
 * - BasePage: Common functionality for all pages
 * - LoginPage: Authentication functionality
 * - DashboardPage: Main application page (product catalog, search, filters, todos)
 * - CartPage: Shopping cart management
 *
 * Traceability:
 * - Maps to all test cases TC-AUTH-001 to TC-PERSIST-008
 * - Covers all requirements REQ-F-001 to REQ-F-011, REQ-NF-001 to REQ-NF-005
 * - Implements all user stories US-001 to US-022
 */

export { BasePage } from './BasePage';
export { LoginPage } from './LoginPage';
export { DashboardPage } from './DashboardPage';
export { CartPage } from './CartPage';

// Page Object Factory for creating page instances
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { LoginPage } from './LoginPage';
import { DashboardPage } from './DashboardPage';
import { CartPage } from './CartPage';

export class PageObjectFactory {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  createLoginPage(): LoginPage {
    return new LoginPage(this.page);
  }

  createDashboardPage(): DashboardPage {
    return new DashboardPage(this.page);
  }

  createCartPage(): CartPage {
    return new CartPage(this.page);
  }
}

// Type definitions for better TypeScript support
export interface PageObjects {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  cartPage: CartPage;
}

// Helper function to create all page objects at once
export function createPageObjects(page: Page): PageObjects {
  return {
    loginPage: new LoginPage(page),
    dashboardPage: new DashboardPage(page),
    cartPage: new CartPage(page)
  };
}