import { Browser, BrowserContext, Page, chromium, firefox, webkit } from '@playwright/test';
import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import { PageObjects, createPageObjects } from '../page-objects';

/**
 * Custom World class for Cucumber tests
 * Provides shared state and browser management across test steps
 */
export class CustomWorld extends World {
  public browser!: Browser;
  public context!: BrowserContext;
  public page!: Page;
  public pageObjects!: PageObjects;

  // Test configuration
  public config: {
    appUrl: string;
    browserType: string;
    headless: boolean;
    slowMo: number;
    timeout: number;
  };

  // Test state management
  public testData: Map<string, any> = new Map();
  public previousValues: Map<string, any> = new Map();

  constructor(options: IWorldOptions) {
    super(options);

    // Initialize configuration from world parameters and environment variables
    this.config = {
      appUrl: process.env.APP_URL || options.parameters?.appUrl || 'http://localhost:8000',
      browserType: process.env.BROWSER || options.parameters?.browser || 'chromium',
      headless: process.env.HEADLESS !== 'false' && options.parameters?.headless !== false,
      slowMo: parseInt(process.env.SLOW_MO || options.parameters?.slowMo || '0'),
      timeout: parseInt(process.env.TIMEOUT || options.parameters?.timeout || '30000')
    };
  }

  /**
   * Initialize browser and page for test scenario
   */
  async init(): Promise<void> {
    // Launch browser based on configuration
    switch (this.config.browserType.toLowerCase()) {
      case 'firefox':
        this.browser = await firefox.launch({
          headless: this.config.headless,
          slowMo: this.config.slowMo
        });
        break;
      case 'webkit':
      case 'safari':
        this.browser = await webkit.launch({
          headless: this.config.headless,
          slowMo: this.config.slowMo
        });
        break;
      case 'chromium':
      case 'chrome':
      default:
        this.browser = await chromium.launch({
          headless: this.config.headless,
          slowMo: this.config.slowMo
        });
        break;
    }

    // Create browser context with test configuration
    this.context = await this.browser.newContext({
      viewport: { width: 1280, height: 720 },
      locale: 'ja-JP',
      timezoneId: 'Asia/Tokyo',
      permissions: ['geolocation'],
      recordVideo: process.env.CI ? { dir: './test-results/videos' } : undefined
    });

    // Create new page
    this.page = await this.context.newPage();

    // Set default timeout
    this.page.setDefaultTimeout(this.config.timeout);

    // Initialize page objects
    this.pageObjects = createPageObjects(this.page);

    // Setup error handling
    this.setupErrorHandling();
  }

  /**
   * Setup error handling and logging for debugging
   */
  private setupErrorHandling(): void {
    // Console logging
    this.page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.error(`Browser console error: ${msg.text()}`);
      }
    });

    // Page error handling
    this.page.on('pageerror', (error) => {
      console.error(`Page error: ${error.message}`);
    });

    // Request failed handling
    this.page.on('requestfailed', (request) => {
      console.error(`Request failed: ${request.url()} - ${request.failure()?.errorText}`);
    });
  }

  /**
   * Navigate to application URL
   */
  async navigateToApp(): Promise<void> {
    await this.page.goto(this.config.appUrl);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Clear application state (localStorage, cookies, etc.)
   */
  async clearApplicationState(): Promise<void> {
    await this.page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await this.context.clearCookies();
  }

  /**
   * Store test data for later retrieval
   */
  setTestData(key: string, value: any): void {
    this.testData.set(key, value);
  }

  /**
   * Retrieve stored test data
   */
  getTestData(key: string): any {
    return this.testData.get(key);
  }

  /**
   * Store previous value for comparison
   */
  setPreviousValue(key: string, value: any): void {
    this.previousValues.set(key, value);
  }

  /**
   * Get previous value for comparison
   */
  getPreviousValue(key: string): any {
    return this.previousValues.get(key);
  }

  /**
   * Take screenshot for debugging
   */
  async takeScreenshot(name: string): Promise<Buffer> {
    const screenshot = await this.page.screenshot({
      path: `./test-results/screenshots/${name}-${Date.now()}.png`,
      fullPage: true
    });
    return screenshot;
  }

  /**
   * Wait for network to be idle
   */
  async waitForNetworkIdle(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Simulate browser restart
   */
  async simulateBrowserRestart(): Promise<void> {
    await this.browser.close();
    await this.init();
    await this.navigateToApp();
  }

  /**
   * Restart browser context (alias for simulateBrowserRestart)
   */
  async restartBrowserContext(): Promise<void> {
    await this.simulateBrowserRestart();
  }

  /**
   * Check if element exists without throwing error
   */
  async elementExists(selector: string): Promise<boolean> {
    try {
      const element = await this.page.waitForSelector(selector, { timeout: 5000 });
      return element !== null;
    } catch {
      return false;
    }
  }

  /**
   * Get localStorage content as object
   */
  async getLocalStorageState(): Promise<Record<string, string>> {
    return await this.page.evaluate(() => {
      const storage: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          storage[key] = localStorage.getItem(key) || '';
        }
      }
      return storage;
    });
  }

  /**
   * Set localStorage content from object
   */
  async setLocalStorageState(state: Record<string, string>): Promise<void> {
    await this.page.evaluate((state) => {
      Object.entries(state).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });
    }, state);
  }

  /**
   * Cleanup resources after scenario
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
    this.previousValues.clear();
  }

  /**
   * Generate test data for forms
   */
  generateTestData(): {
    validCredentials: { username: string; password: string };
    invalidCredentials: { username: string; password: string }[];
    sampleProducts: string[];
    sampleTodos: string[];
  } {
    return {
      validCredentials: {
        username: 'demo',
        password: 'password'
      },
      invalidCredentials: [
        { username: 'invalid', password: 'password' },
        { username: 'demo', password: 'wrongpass' },
        { username: '', password: 'password' },
        { username: 'demo', password: '' },
        { username: '', password: '' }
      ],
      sampleProducts: [
        'スマートフォン',
        'ノートパソコン',
        'Tシャツ',
        'ジーンズ',
        'プログラミング入門書',
        'ワイヤレスイヤホン'
      ],
      sampleTodos: [
        'ワイヤレスイヤホンを検討',
        'スニーカーの価格調査',
        'プログラミング本のレビュー確認',
        'ノートパソコンの仕様比較'
      ]
    };
  }

  /**
   * Assert helper methods for common checks
   */
  async assertPageUrl(expectedUrl: string): Promise<void> {
    const currentUrl = this.page.url();
    if (!currentUrl.includes(expectedUrl)) {
      throw new Error(`Expected URL to contain '${expectedUrl}', but got '${currentUrl}'`);
    }
  }

  async assertElementVisible(selector: string, message?: string): Promise<void> {
    const element = this.page.locator(selector);
    const isVisible = await element.isVisible();
    if (!isVisible) {
      throw new Error(message || `Element '${selector}' should be visible`);
    }
  }

  async assertElementContainsText(selector: string, expectedText: string, message?: string): Promise<void> {
    const element = this.page.locator(selector);
    const actualText = await element.textContent() || '';
    if (!actualText.includes(expectedText)) {
      throw new Error(message || `Element '${selector}' should contain text '${expectedText}', but got '${actualText}'`);
    }
  }
}

// Set the custom world constructor for Cucumber
setWorldConstructor(CustomWorld);