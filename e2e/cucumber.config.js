const config = {
  require: [
    'ts-node/register',
    './step-definitions/**/*.ts',
    './support/**/*.ts'
  ],
  requireModule: ['ts-node/register'],
  format: [
    'progress',
    'json:reports/cucumber-report.json',
    'html:reports/cucumber-report.html'
  ],
  formatOptions: {
    snippetInterface: 'async-await'
  },
  publishQuiet: true,
  dryRun: false,
  failFast: false,
  strict: true,
  worldParameters: {
    appUrl: process.env.APP_URL || 'http://localhost:8000',
    browser: process.env.BROWSER || 'chromium',
    headless: process.env.HEADLESS !== 'false',
    timeout: parseInt(process.env.TIMEOUT || '30000')
  }
};

module.exports = config;