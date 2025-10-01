import { Browser, BrowserContext, Page, chromium, firefox, webkit } from '@playwright/test';
import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import { LoginPage } from '../page-objects/LoginPage';
import { DashboardPage } from '../page-objects/DashboardPage';
import { CheckoutPage } from '../page-objects/CheckoutPage';

export class CustomWorld extends World {
  public browser!: Browser;
  public context!: BrowserContext;
  public page!: Page;
  public loginPage!: LoginPage;
  public dashboardPage!: DashboardPage;
  public checkoutPage!: CheckoutPage;

  // Configuration
  public config: {
    appUrl: string;
    browserType: string;
    headless: boolean;
    timeout: number;
  };

  // Test data storage
  private testData: Map<string, any> = new Map();

  constructor(options: IWorldOptions) {
    super(options);

    // Initialize configuration from world parameters and environment variables
    this.config = {
      appUrl: process.env.APP_URL || options.parameters?.appUrl || 'http://localhost:8000',
      browserType: process.env.BROWSER || options.parameters?.browser || 'chromium',
      headless: process.env.HEADLESS !== 'false' && options.parameters?.headless !== false,
      timeout: parseInt(process.env.TIMEOUT || options.parameters?.timeout || '30000')
    };
  }

  /**
   * Initialize browser and page objects
   */
  async init(): Promise<void> {
    // Launch browser
    switch (this.config.browserType.toLowerCase()) {
      case 'firefox':
        this.browser = await firefox.launch({ headless: this.config.headless });
        break;
      case 'webkit':
      case 'safari':
        this.browser = await webkit.launch({ headless: this.config.headless });
        break;
      case 'chromium':
      case 'chrome':
      default:
        this.browser = await chromium.launch({ headless: this.config.headless });
        break;
    }

    // Create context and page
    this.context = await this.browser.newContext({
      viewport: { width: 1280, height: 720 }
    });

    this.page = await this.context.newPage();
    this.page.setDefaultTimeout(this.config.timeout);

    // Initialize page objects
    this.loginPage = new LoginPage(this.page, this.config.appUrl);
    this.dashboardPage = new DashboardPage(this.page, this.config.appUrl);
    this.checkoutPage = new CheckoutPage(this.page);

    // Setup error handling
    this.setupErrorHandling();
  }

  /**
   * Setup error handling for debugging
   */
  private setupErrorHandling(): void {
    this.page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.error(`Browser console error: ${msg.text()}`);
      }
    });

    this.page.on('pageerror', (error) => {
      console.error(`Page error: ${error.message}`);
    });
  }

  /**
   * Store test data
   */
  setTestData(key: string, value: any): void {
    this.testData.set(key, value);
  }

  /**
   * Retrieve test data
   */
  getTestData(key: string): any {
    return this.testData.get(key);
  }

  /**
   * Clear application state
   */
  async clearApplicationState(): Promise<void> {
    try {
      // Only clear localStorage if we have navigated to a page
      if (this.page.url() !== 'about:blank') {
        await this.page.evaluate(() => {
          if (typeof localStorage !== 'undefined') {
            localStorage.clear();
          }
          if (typeof sessionStorage !== 'undefined') {
            sessionStorage.clear();
          }
        });
      }
      await this.context.clearCookies();
    } catch (error) {
      // Ignore localStorage access errors (e.g., about:blank page)
      console.warn('Could not clear application state:', error);
    }
  }

  /**
   * Take screenshot for debugging
   */
  async takeScreenshot(name: string): Promise<Buffer | null> {
    try {
      if (this.page && !this.page.isClosed()) {
        const screenshot = await this.page.screenshot({
          path: `./screenshots/${name}-${Date.now()}.png`,
          fullPage: true
        });
        return screenshot;
      }
    } catch (error) {
      console.error('Failed to take screenshot:', error);
    }
    return null;
  }

  /**
   * Clean up resources
   */
  async cleanup(): Promise<void> {
    if (this.page && !this.page.isClosed()) {
      await this.page.close();
    }
    if (this.context) {
      await this.context.close();
    }
    if (this.browser) {
      await this.browser.close();
    }

    // Clear test data
    this.testData.clear();
  }
}

// Set the custom world constructor for Cucumber
setWorldConstructor(CustomWorld);