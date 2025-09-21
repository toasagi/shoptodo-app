# 🚀 クイックスタートガイド

> **新規PC・開発者向け**: このプロジェクトを最短時間でセットアップし、E2Eテスト自動化学習を開始するためのガイド

## ⚡ 5分で始める

### 📋 前提条件チェック
```bash
# Node.js バージョン確認（v18以上必要）
node --version

# Gitインストール確認
git --version

# ブラウザ確認（Chrome、Firefox、Safari推奨）
```

### 🛠️ インストール手順

#### ステップ1: プロジェクト取得
```bash
# リポジトリクローン
git clone [repository-url]
cd shoptodo-app

# プロジェクト構造確認
ls -la
```

#### ステップ2: アプリケーション起動（2分）
```bash
# 依存関係インストール
npm install

# アプリケーション起動
npm run serve

# ブラウザで確認
open http://localhost:8000
```

**✅ 確認ポイント**:
- ログイン画面が表示される
- `demo` / `password` でログイン可能
- 12個の商品が表示される

#### ステップ3: E2E自動化テスト（3分）
```bash
# E2E環境移動
cd e2e

# 依存関係インストール
npm install

# Playwrightブラウザインストール（初回のみ）
npm run test:install

# スモークテスト実行
npm run test:e2e:smoke
```

**✅ 確認ポイント**:
- テストが自動実行される
- ブラウザが自動操作される
- 全テストが PASSED になる

## 🎯 主要コマンド一覧

### アプリケーション操作
```bash
# アプリケーション起動
npm run serve

# 単体テスト実行
npm test

# 単体テスト（カバレッジ付き）
npm run test:coverage
```

### E2E自動化テスト
```bash
cd e2e

# 🔥 最重要: スモークテスト（5分）
npm run test:e2e:smoke

# 完全回帰テスト（15分）
npm run test:e2e:regression

# 並列実行（高速）
npm run test:e2e:parallel

# デバッグ実行（GUI表示）
HEADLESS=false npm run test:e2e:smoke

# レポート生成
npm run test:e2e:report
```

### ブラウザ別実行
```bash
# Chrome
BROWSER=chromium npm run test:e2e:smoke

# Firefox
BROWSER=firefox npm run test:e2e:smoke

# Safari
BROWSER=webkit npm run test:e2e:smoke
```

## 📚 学習パス（推奨順序）

### 🎓 Level 1: 基本理解（1日）
1. **アプリケーション体験**
   ```bash
   npm run serve
   # http://localhost:8000 で手動操作
   ```

2. **文書読み込み**
   ```
   📖 PROJECT_SUMMARY.md      # プロジェクト全体理解
   📖 docs/test-planning/test-strategy.md  # テスト戦略
   📖 docs/test-design/user-stories.md     # ユーザーストーリー
   ```

3. **単体テスト確認**
   ```bash
   npm test
   # 108テストケース動作確認
   ```

### 🎓 Level 2: 自動化理解（2-3日）
1. **E2E実行体験**
   ```bash
   cd e2e
   npm run test:e2e:smoke
   ```

2. **Page Object理解**
   ```
   📁 e2e/page-objects/
   ├── BasePage.ts          # 共通機能
   ├── LoginPage.ts         # 認証画面
   ├── DashboardPage.ts     # メイン画面
   └── CartPage.ts          # カート画面
   ```

3. **Cucumber記法学習**
   ```
   📁 e2e/features/
   ├── authentication.feature      # Gherkin記法
   ├── product-catalog.feature     # シナリオ例
   └── shopping-cart.feature       # BDD実践
   ```

### 🎓 Level 3: 実践・拡張（1週間）
1. **新規テストケース追加**
2. **Page Object拡張**
3. **独自シナリオ作成**

## 🔧 よくある問題・解決策

### ❌ ポート8000が使用中
```bash
# 解決策1: プロセス確認・終了
lsof -ti:8000
kill -9 [PID]

# 解決策2: 別ポート使用
python3 -m http.server 8001
```

### ❌ Playwrightインストールエラー
```bash
# 解決策: 手動インストール
npx playwright install chromium
npx playwright install firefox
npx playwright install webkit
```

### ❌ TypeScriptコンパイルエラー
```bash
# 解決策: 依存関係再インストール
cd e2e
rm -rf node_modules package-lock.json
npm install
```

### ❌ テスト実行時ブラウザエラー
```bash
# 解決策: ヘッドフルモードで実行（デバッグ）
HEADLESS=false npm run test:e2e:smoke
```

## 📖 重要ファイル・フォルダ

### 🎯 すぐに見るべきファイル
```
📄 PROJECT_SUMMARY.md                    # プロジェクト完全ガイド
📄 QUICK_START_GUIDE.md                  # 本ファイル
📄 e2e/features/authentication.feature   # テストシナリオ例
📄 e2e/page-objects/LoginPage.ts         # Page Object例
📄 docs/test-design/test-cases.md        # 詳細テストケース
```

### 📁 主要ディレクトリ
```
shoptodo-app/
├── 📁 docs/              # ISTQBテスト文書
├── 📁 tests/             # 単体テスト（Jest）
├── 📁 e2e/               # E2E自動化テスト
│   ├── 📁 features/      # Gherkinシナリオ
│   ├── 📁 page-objects/  # Page Objectクラス
│   ├── 📁 step-definitions/ # Cucumberステップ
│   └── 📁 data/          # テストデータ
├── 📄 app.js             # メインアプリケーション
├── 📄 index.html         # HTML構造
└── 📄 styles.css         # スタイルシート
```

## 🎮 実践演習

### 🏋️ 演習1: 手動テスト（15分）
1. アプリケーション起動
2. 全機能を手動で操作
3. 意図した動作を確認

### 🏋️ 演習2: テストケース理解（30分）
1. `docs/test-design/test-cases.md` 読み込み
2. TC-AUTH-001（認証テストケース）を手動実行
3. 期待結果と実際の動作を比較

### 🏋️ 演習3: 自動化実行（15分）
1. スモークテスト実行
2. 実行ログ確認
3. スクリーンショット確認（test-results/）

### 🏋️ 演習4: 新規テスト作成（60分）
1. 新しいシナリオを考案
2. Gherkin記法でシナリオ記述
3. Step Definition実装
4. テスト実行・デバッグ

## 📞 サポート・参考資料

### 🆘 問題解決
1. **エラーログ確認**: `e2e/test-results/` ディレクトリ
2. **スクリーンショット**: 失敗時自動取得
3. **設定確認**: `e2e/cucumber.js`, `e2e/playwright.config.ts`

### 📚 学習リソース
- **Playwright公式**: https://playwright.dev
- **Cucumber公式**: https://cucumber.io
- **ISTQB**: International Software Testing Qualifications Board
- **IEEE 829**: Test Documentation Standard

### 🔗 関連技術
- **Page Object Model**: E2E自動化のデザインパターン
- **BDD**: Behavior Driven Development
- **Gherkin**: 自然言語テスト記述言語

## ⚡ 次のステップ

### ✅ 基本習得後（1週間後）
1. **CI/CD統合学習**: GitHub Actions設定
2. **他ツール比較**: Selenium、Cypress等
3. **パフォーマンステスト**: Lighthouse統合

### ✅ 応用レベル（1か月後）
1. **独自プロジェクト**: 学んだ技術で新規プロジェクト作成
2. **チーム展開**: 他メンバーへの知識共有
3. **継続改善**: プロセス・ツールの最適化

---

**🎯 目標**: このガイドに従って30分以内に自動化テストが実行できることを目指しています。問題があれば、PROJECT_SUMMARY.md の詳細情報を参照してください。**