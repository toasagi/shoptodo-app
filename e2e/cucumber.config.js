const config = {
  requireModule: ['ts-node/register'],
  require: [
    'step-definitions/**/*.ts',
    'support/**/*.ts'
  ],
  format: [
    'progress',
    'json:reports/cucumber-report.json',
    'html:reports/cucumber-report.html',
    'allure-cucumberjs/reporter'
  ],
  formatOptions: {
    snippetInterface: 'async-await',
    resultsDir: './allure-results'
  },
  publishQuiet: true,
  dryRun: false,
  failFast: false,
  strict: true,
  timeout: 30000, // 30 seconds timeout for each step
  worldParameters: {
    appUrl: process.env.APP_URL || 'http://localhost:8000',
    browser: process.env.BROWSER || 'chromium',
    headless: process.env.HEADLESS !== 'false',
    timeout: parseInt(process.env.TIMEOUT || '30000')
  }
};

module.exports = config;