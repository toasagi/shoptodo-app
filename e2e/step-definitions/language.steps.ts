import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

// Given Steps
Given('the language is set to Japanese', async function(this: CustomWorld) {
  // Click the Japanese language button (#lang-ja)
  const jaButton = this.page.locator('#lang-ja');
  await jaButton.click();
  await this.page.waitForTimeout(500);

  // Verify language is set to Japanese (localStorage uses 'ja' not 'jp')
  const lang = await this.dashboardPage.getCurrentLanguage();
  expect(['ja', 'jp'].includes(lang), 'Language should be set to Japanese').toBe(true);
});

// When Steps
When('the user switches language to Japanese', async function(this: CustomWorld) {
  // Click the Japanese language button (#lang-ja)
  await this.page.locator('#lang-ja').click();
  await this.page.waitForTimeout(500);
});

When('the user switches language to English', async function(this: CustomWorld) {
  // Click the English language button (#lang-en)
  await this.page.locator('#lang-en').click();
  await this.page.waitForTimeout(500);
});

// Then Steps
Then('the UI should display in Japanese', async function(this: CustomWorld) {
  // Check language in localStorage (can be 'ja' or 'jp')
  const lang = await this.dashboardPage.getCurrentLanguage();
  expect(['ja', 'jp'].includes(lang), 'Language should be Japanese').toBe(true);

  // Verify some UI text is in Japanese
  const uiTexts = await this.dashboardPage.getUITextsInCurrentLanguage();
  expect(
    uiTexts.logoutButton.includes('ログアウト') || uiTexts.addButton.includes('追加'),
    'UI should display Japanese text'
  ).toBe(true);
});

Then('the UI should display in English', async function(this: CustomWorld) {
  const lang = await this.dashboardPage.getCurrentLanguage();
  expect(lang, 'Language should be English').toBe('en');

  // Verify some UI text is in English
  const uiTexts = await this.dashboardPage.getUITextsInCurrentLanguage();
  expect(
    uiTexts.logoutButton.toLowerCase().includes('logout') || uiTexts.addButton.toLowerCase().includes('add'),
    'UI should display English text'
  ).toBe(true);
});

Then('the logout button text should be in Japanese', async function(this: CustomWorld) {
  const uiTexts = await this.dashboardPage.getUITextsInCurrentLanguage();
  expect(uiTexts.logoutButton, 'Logout button should be in Japanese').toContain('ログアウト');
});

Then('the logout button text should be {string}', async function(this: CustomWorld, expectedText: string) {
  const uiTexts = await this.dashboardPage.getUITextsInCurrentLanguage();
  expect(
    uiTexts.logoutButton.toLowerCase(),
    `Logout button should contain "${expectedText}"`
  ).toContain(expectedText.toLowerCase());
});
