import { Before, After, BeforeAll, AfterAll, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { CustomWorld } from './world';

// Set default timeout for all steps to 30 seconds
setDefaultTimeout(30000);

// Global setup
BeforeAll(async function() {
  console.log('🚀 Starting Login E2E Tests');
  console.log('App URL:', process.env.APP_URL || 'http://localhost:8000');
  console.log('Browser:', process.env.BROWSER || 'chromium');
  console.log('Headless:', process.env.HEADLESS !== 'false');
});

// Global cleanup
AfterAll(async function() {
  console.log('✅ Login E2E Tests Completed');
});

// Setup before each scenario
Before(async function(this: CustomWorld, scenario) {
  console.log(`\n🎬 Starting: ${scenario.pickle.name}`);

  // Initialize browser and page objects
  await this.init();

  // Store scenario info for debugging
  this.setTestData('scenarioName', scenario.pickle.name);
});

// Cleanup after each scenario
After(async function(this: CustomWorld, scenario) {
  const scenarioName = scenario.pickle.name;
  const scenarioStatus = scenario.result?.status;

  console.log(`📊 ${scenarioName}: ${scenarioStatus}`);

  // Take screenshot on failure
  if (scenarioStatus === Status.FAILED) {
    console.log('📸 Taking failure screenshot');
    try {
      await this.takeScreenshot(`failure-${scenarioName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`);
    } catch (error) {
      console.error('Failed to take screenshot:', error);
    }
  }

  // Clean up browser resources
  await this.cleanup();
});