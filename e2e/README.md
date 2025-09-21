# E2E自動化テスト - 技術ドキュメント

## 🏗️ アーキテクチャ概要

このE2E自動化テストは、**Page Object Model (POM)** + **Cucumber BDD** の組み合わせで構築されています。

### 📐 設計原則
1. **保守性**: 画面変更時の修正を局所化
2. **可読性**: 非技術者でも理解可能なテストシナリオ
3. **再利用性**: 共通操作の抽象化と再利用
4. **トレーサビリティ**: 要件→テストケース→自動化の完全対応

## 📁 ディレクトリ構成

```
e2e/
├── package.json                 # 依存関係・スクリプト定義
├── tsconfig.json               # TypeScript設定
├── cucumber.js                 # Cucumber実行設定
├── playwright.config.ts        # Playwright設定
├── features/                   # Gherkinシナリオ（7ファイル）
│   ├── authentication.feature
│   ├── product-catalog.feature
│   ├── shopping-cart.feature
│   ├── todo-list.feature
│   ├── language-switching.feature
│   ├── data-persistence.feature
│   └── end-to-end-scenarios.feature
├── step-definitions/           # ステップ定義（4ファイル）
│   ├── authentication.steps.ts
│   ├── product-catalog.steps.ts
│   ├── shopping-cart.steps.ts
│   └── common.steps.ts
├── page-objects/              # Page Objectクラス（4ファイル）
│   ├── BasePage.ts
│   ├── LoginPage.ts
│   ├── DashboardPage.ts
│   ├── CartPage.ts
│   └── index.ts
├── support/                   # テスト環境・共通機能
│   ├── world.ts               # CustomWorld（共有状態管理）
│   └── hooks.ts               # Before/After処理
├── data/                      # テストデータ
│   └── test-data.json
├── utils/                     # ユーティリティ
│   └── TestDataManager.ts
├── test-results/              # 実行結果（自動生成）
├── reports/                   # レポート（自動生成）
└── screenshots/               # スクリーンショット（自動生成）
```

## 🎭 Page Object Model 詳細

### BasePage.ts - 基底クラス
全Page Objectの共通機能を提供:
```typescript
export abstract class BasePage {
  // 共通操作: ナビゲーション、要素待機、アサート等
  async goto(): Promise<void>
  async waitForPageLoad(): Promise<void>
  async clickElement(locator: Locator): Promise<void>
  async fillInput(locator: Locator, value: string): Promise<void>
  // ... その他共通メソッド
}
```

### LoginPage.ts - 認証画面
```typescript
export class LoginPage extends BasePage {
  // TC-AUTH-001~009 対応
  async login(username: string, password: string): Promise<void>
  async assertSuccessfulLogin(): Promise<void>
  async assertLoginFailure(expectedErrorMessage: string): Promise<void>
  // ... 認証関連メソッド
}
```

### DashboardPage.ts - メイン画面
```typescript
export class DashboardPage extends BasePage {
  // TC-CATALOG-001~019, TC-CART-001~004, TC-TODO-001~008 対応

  // 商品カタログ機能
  async getProductCount(): Promise<number>
  async enterSearchTerm(searchTerm: string): Promise<void>
  async clickElectronicsFilter(): Promise<void>
  async sortByPriceAscending(): Promise<void>

  // ショッピングカート機能
  async addProductToCart(productName: string): Promise<void>
  async getCartItemCount(): Promise<string>

  // ToDo機能
  async addTodoItem(todoText: string): Promise<void>
  async toggleTodoCompletion(todoText: string): Promise<void>

  // 言語切り替え機能
  async clickEnglishLanguageButton(): Promise<void>
  async assertLanguageSwitch(language: 'en' | 'jp'): Promise<void>
}
```

### CartPage.ts - カート画面
```typescript
export class CartPage extends BasePage {
  // TC-CART-005~013 対応
  async changeItemQuantity(itemName: string, newQuantity: string): Promise<void>
  async deleteItem(itemName: string): Promise<void>
  async completeCheckout(): Promise<void>
  async assertSuccessfulCheckout(): Promise<void>
  // ... カート管理メソッド
}
```

## 🥒 Cucumber BDD 構成

### Feature Files（Gherkin記法）
```gherkin
# authentication.feature
@authentication @smoke @regression
Feature: User Authentication
  As a test learner
  I want to be able to log in and out of the application
  So that I can learn authentication testing techniques

  @smoke @priority-high
  Scenario: TC-AUTH-001 - Successful login with valid credentials
    Given the login modal is displayed
    When the user enters username "demo"
    And the user enters password "password"
    And the user clicks the login button
    Then the user should be logged in successfully
    And the dashboard page should be displayed
```

### Step Definitions（実装）
```typescript
// authentication.steps.ts
Given('the login modal is displayed', async function(this: CustomWorld) {
  const isDisplayed = await this.pageObjects.loginPage.isLoginModalDisplayed();
  expect(isDisplayed, 'Login modal should be displayed').toBe(true);
});

When('the user enters username {string}', async function(this: CustomWorld, username: string) {
  await this.pageObjects.loginPage.enterUsername(username);
});

Then('the user should be logged in successfully', async function(this: CustomWorld) {
  await this.pageObjects.loginPage.assertSuccessfulLogin();
});
```

## 🌍 World & Hooks

### CustomWorld.ts - 状態管理
```typescript
export class CustomWorld extends World {
  public browser!: Browser;
  public page!: Page;
  public pageObjects!: PageObjects;

  // テスト状態管理
  public testData: Map<string, any> = new Map();

  // ブラウザ初期化
  async init(): Promise<void>

  // テストデータ管理
  setTestData(key: string, value: any): void
  getTestData(key: string): any
}
```

### Hooks.ts - テスト前後処理
```typescript
// 各シナリオ前の準備
Before(async function(this: CustomWorld, scenario) {
  await this.init();                    // ブラウザ初期化
  await this.navigateToApp();          // アプリアクセス
  await this.clearApplicationState();  // 状態クリア
});

// 失敗時スクリーンショット
After(async function(this: CustomWorld, scenario) {
  if (scenario.result?.status === Status.FAILED) {
    await this.takeScreenshot(`failure-${scenarioName}`);
  }
  await this.cleanup();
});
```

## 📊 テストデータ管理

### TestDataManager.ts - データ管理クラス
```typescript
export class TestDataManager {
  // ユーザーデータ
  getValidUser(username: string = 'demo'): UserCredentials
  getInvalidUsers(): UserCredentials[]

  // 商品データ
  getProducts(language: 'japanese' | 'english'): Product[]
  getProductsByCategory(category: string): Product[]

  // 検索データ
  getSearchTerms(language: 'japanese' | 'english'): SearchTerm[]

  // バリデーションデータ
  getXSSPayloads(): string[]
  getBoundaryValues(): any
}
```

### test-data.json - 構造化データ
```json
{
  "users": {
    "valid": { "demo": { "username": "demo", "password": "password" } },
    "invalid": [
      { "username": "invalid", "password": "password", "expectedError": "無効な認証情報です" }
    ]
  },
  "products": {
    "japanese": [
      { "id": 1, "name": "スマートフォン", "price": "89,800円", "category": "electronics" }
    ],
    "english": [
      { "id": 1, "name": "Smartphone", "price": "89,800円", "category": "electronics" }
    ]
  }
}
```

## ⚙️ 実行設定

### cucumber.js - Cucumber設定
```javascript
const config = {
  require: ['ts-node/register', './step-definitions/**/*.ts'],
  format: ['@cucumber/pretty-formatter', 'json:reports/cucumber-report.json'],
  parallel: 1,
  retry: 1,
  worldParameters: {
    appUrl: process.env.APP_URL || 'http://localhost:8000',
    browser: process.env.BROWSER || 'chromium',
    headless: process.env.HEADLESS !== 'false'
  }
};
```

### playwright.config.ts - Playwright設定
```typescript
export default defineConfig({
  timeout: 30000,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:8000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } }
  ]
});
```

## 🚀 実行コマンド

### 基本実行
```bash
# スモークテスト（重要機能のみ、5分）
npm run test:e2e:smoke

# 回帰テスト（全機能、15分）
npm run test:e2e:regression

# 並列実行（高速化）
npm run test:e2e:parallel

# レポート生成
npm run test:e2e:report
```

### 環境変数カスタマイズ
```bash
# ブラウザ指定
BROWSER=firefox npm run test:e2e:smoke

# ヘッドフル実行（GUI表示）
HEADLESS=false npm run test:e2e:smoke

# 特定タグ実行
npm run test:e2e -- --tags '@authentication'

# デバッグ実行
npm run test:debug
```

## 🔍 デバッグ・トラブルシューティング

### ログレベル設定
```bash
# 詳細ログ出力
DEBUG=pw:api npm run test:e2e:smoke

# Cucumber詳細情報
npm run test:e2e -- --format progress
```

### スクリーンショット確認
```bash
# 失敗時スクリーンショット場所
ls -la test-results/screenshots/

# 手動スクリーンショット取得
await this.takeScreenshot('debug-point');
```

### よくある問題と解決策

#### 1. 要素が見つからない
```typescript
// 解決策: 明示的待機
await this.page.waitForSelector('#element', { timeout: 10000 });
await this.page.locator('#element').waitFor({ state: 'visible' });
```

#### 2. タイミング問題
```typescript
// 解決策: ネットワーク待機
await this.page.waitForLoadState('networkidle');
await this.page.waitForTimeout(500); // 最後の手段
```

#### 3. 状態不整合
```typescript
// 解決策: 状態確認・初期化
Before(async function() {
  await this.clearApplicationState();
  await this.navigateToApp();
});
```

## 📈 メトリクス・レポート

### 自動生成レポート
- **Cucumber HTML**: `reports/cucumber-report.html`
- **Playwright Report**: `reports/playwright-report/`
- **JSON Results**: `reports/cucumber-report.json`

### メトリクス取得
```typescript
// 実行時間測定
this.setTestData('testStartTime', Date.now());
// ... テスト実行
const duration = Date.now() - this.getTestData('testStartTime');

// カバレッジ取得（パフォーマンステスト時）
const coverage = await this.page.coverage.stopJSCoverage();
```

## 🎯 ベストプラクティス

### 1. Page Object設計
- **単一責任**: 1つのページ = 1つのクラス
- **抽象化**: 実装詳細をテストから隠蔽
- **再利用性**: 共通操作の基底クラス化

### 2. Gherkin記述
- **自然言語**: 非技術者が理解可能
- **具体例**: 曖昧さを排除した明確な記述
- **再利用**: 共通ステップの活用

### 3. テストデータ管理
- **外部化**: コードとデータの分離
- **バリエーション**: 正常・異常・境界値
- **言語対応**: 多言語テストデータ

### 4. エラーハンドリング
- **スクリーンショット**: 失敗時の自動取得
- **ログ収集**: 詳細な実行ログ
- **リトライ**: 不安定テストの対策

---

**📝 このドキュメントは技術実装の詳細理解を目的としています。実際のテスト実行は QUICK_START_GUIDE.md を参照してください。**