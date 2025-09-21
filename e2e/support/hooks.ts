import { Before, After, BeforeAll, AfterAll, Status } from '@cucumber/cucumber';
import { CustomWorld } from './world';

/**
 * Test Hooks for setup and teardown
 * Provides consistent test environment management
 */

// Global setup before all tests
BeforeAll(async function() {
  console.log('🚀 Starting E2E Test Suite');
  console.log('Environment:', process.env.NODE_ENV || 'development');
  console.log('App URL:', process.env.APP_URL || 'http://localhost:8000');
  console.log('Browser:', process.env.BROWSER || 'chromium');
  console.log('Headless:', process.env.HEADLESS !== 'false');
});

// Global cleanup after all tests
AfterAll(async function() {
  console.log('✅ E2E Test Suite Completed');
});

// Setup before each scenario
Before(async function(this: CustomWorld, scenario) {
  console.log(`\n🎬 Starting scenario: ${scenario.pickle.name}`);

  // Initialize browser and page
  await this.init();

  // Navigate to application
  await this.navigateToApp();

  // Clear application state for clean start
  await this.clearApplicationState();

  // Store scenario info for debugging
  this.setTestData('scenarioName', scenario.pickle.name);
  this.setTestData('scenarioTags', scenario.pickle.tags.map(tag => tag.name));

  console.log(`📱 Browser: ${this.config.browserType}`);
  console.log(`🌐 App URL: ${this.config.appUrl}`);
});

// Special setup for authentication scenarios
Before({ tags: '@authentication' }, async function(this: CustomWorld) {
  console.log('🔐 Setting up authentication test environment');

  // Ensure clean login state
  await this.clearApplicationState();

  // Verify login modal is displayed by default
  const loginModalVisible = await this.pageObjects.loginPage.isLoginModalDisplayed();
  if (!loginModalVisible) {
    console.warn('⚠️ Login modal not visible - may affect authentication tests');
  }
});

// Special setup for scenarios requiring login
Before({ tags: '@requires-login' }, async function(this: CustomWorld) {
  console.log('👤 Pre-logging in user for test scenario');

  // Login with demo credentials
  await this.pageObjects.loginPage.loginWithDemoCredentials();

  // Wait for dashboard to load
  await this.pageObjects.dashboardPage.waitForPageLoad();

  // Verify login success
  const username = await this.pageObjects.dashboardPage.getDisplayedUsername();
  if (username !== 'demo') {
    throw new Error('Pre-login failed - dashboard not loaded properly');
  }

  console.log('✅ User pre-logged in successfully');
});

// Special setup for smoke tests
Before({ tags: '@smoke' }, async function(this: CustomWorld) {
  console.log('💨 Running smoke test - ensuring critical functionality');

  // Add any specific smoke test setup here
  this.setTestData('testType', 'smoke');
});

// Special setup for regression tests
Before({ tags: '@regression' }, async function(this: CustomWorld) {
  console.log('🔄 Running regression test - comprehensive functionality check');

  this.setTestData('testType', 'regression');
});

// Special setup for performance tests
Before({ tags: '@performance' }, async function(this: CustomWorld) {
  console.log('⚡ Setting up performance monitoring');

  // Start performance monitoring
  await this.page.coverage.startJSCoverage();
  await this.page.coverage.startCSSCoverage();

  this.setTestData('performanceMonitoring', true);
  this.setTestData('testStartTime', Date.now());
});

// Special setup for data persistence tests
Before({ tags: '@data-persistence' }, async function(this: CustomWorld) {
  console.log('💾 Setting up data persistence test environment');

  // Ensure localStorage is available
  const localStorageAvailable = await this.page.evaluate(() => {
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      return true;
    } catch {
      return false;
    }
  });

  if (!localStorageAvailable) {
    throw new Error('localStorage not available - cannot run persistence tests');
  }

  // Clear any existing test data
  await this.clearApplicationState();
});

// Special setup for cross-browser tests
Before({ tags: '@cross-browser' }, async function(this: CustomWorld) {
  console.log(`🌐 Cross-browser test setup for ${this.config.browserType}`);

  // Browser-specific setup if needed
  switch (this.config.browserType.toLowerCase()) {
    case 'firefox':
      console.log('🦊 Firefox-specific setup');
      break;
    case 'webkit':
    case 'safari':
      console.log('🧭 Safari/WebKit-specific setup');
      break;
    case 'chromium':
    case 'chrome':
    default:
      console.log('🔧 Chrome/Chromium-specific setup');
      break;
  }
});

// Cleanup after each scenario
After(async function(this: CustomWorld, scenario) {
  const scenarioName = scenario.pickle.name;
  const scenarioStatus = scenario.result?.status;

  console.log(`\n🎬 Scenario completed: ${scenarioName}`);
  console.log(`📊 Status: ${scenarioStatus}`);

  // Take screenshot on failure
  if (scenarioStatus === Status.FAILED) {
    console.log('📸 Taking failure screenshot');
    const screenshotName = `failure-${scenarioName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`;
    await this.takeScreenshot(screenshotName);

    // Log browser console errors
    console.log('🔍 Checking for browser console errors...');
    // Note: Console errors are already logged in world.ts setupErrorHandling
  }

  // Performance test cleanup
  if (this.getTestData('performanceMonitoring')) {
    console.log('⚡ Collecting performance data');

    const jsCoverage = await this.page.coverage.stopJSCoverage();
    const cssCoverage = await this.page.coverage.stopCSSCoverage();
    const testEndTime = Date.now();
    const testStartTime = this.getTestData('testStartTime');
    const testDuration = testEndTime - testStartTime;

    console.log(`⏱️ Test duration: ${testDuration}ms`);

    // Store coverage data if needed
    this.setTestData('jsCoverage', jsCoverage);
    this.setTestData('cssCoverage', cssCoverage);
    this.setTestData('testDuration', testDuration);
  }

  // Store final localStorage state for debugging
  const finalLocalStorageState = await this.getLocalStorageState();
  this.setTestData('finalLocalStorageState', finalLocalStorageState);

  // Cleanup browser resources
  await this.cleanup();

  console.log('🧹 Scenario cleanup completed');
});

// Special cleanup for authentication tests
After({ tags: '@authentication' }, async function(this: CustomWorld, scenario) {
  console.log('🔐 Authentication test cleanup');

  // Log final authentication state
  const loginState = await this.getLocalStorageState();
  console.log('🔍 Final auth state:', loginState.loginState || 'No login state');
});

// Special cleanup for data persistence tests
After({ tags: '@data-persistence' }, async function(this: CustomWorld) {
  console.log('💾 Data persistence test cleanup');

  // Log final data state for verification
  const finalState = await this.getLocalStorageState();
  console.log('📊 Final localStorage state:', Object.keys(finalState));
});

// Error handling for failed scenarios
After(async function(this: CustomWorld, scenario) {
  if (scenario.result?.status === Status.FAILED) {
    console.log('\n❌ SCENARIO FAILED');
    console.log(`Scenario: ${scenario.pickle.name}`);
    console.log(`Error: ${scenario.result.message}`);

    // Additional debugging information
    const currentUrl = this.page.url();
    console.log(`Current URL: ${currentUrl}`);

    // Take additional screenshot with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await this.takeScreenshot(`failed-${timestamp}`);

    // Log page title for context
    const pageTitle = await this.page.title();
    console.log(`Page title: ${pageTitle}`);
  }
});