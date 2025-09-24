const { chromium } = require('@playwright/test');

(async () => {
  console.log('🚀 Starting simple test');

  try {
    // Launch browser
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log('🌐 Navigating to application');
    await page.goto('http://localhost:8001');

    console.log('📄 Page title:', await page.title());

    // Check if login modal is visible
    const loginModal = await page.locator('#login-modal').isVisible();
    console.log('🔐 Login modal visible:', loginModal);

    // Check if products are loaded
    const productCount = await page.locator('.product-item').count();
    console.log('🛍️ Product count:', productCount);

    await browser.close();
    console.log('✅ Simple test completed successfully');

  } catch (error) {
    console.error('❌ Simple test failed:', error);
    process.exit(1);
  }
})();