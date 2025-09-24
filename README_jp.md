# ShopTodo - E2Eテスト練習用Webアプリケーション

E2E（End-to-End）テストの練習に最適なシンプルなWebアプリケーションです。

## 機能概要

### 1. ユーザー認証
- **ログイン**: デモユーザーでログイン可能
- **ログアウト**: セッション管理
- **デモ認証情報**:
  - ユーザー名: `demo`
  - パスワード: `password`

### 2. 商品カタログ
- **商品一覧表示**: 12種類のサンプル商品
- **検索機能**: 商品名での部分一致検索
- **カテゴリフィルタ**: 電子機器、衣類、書籍、ホーム
- **ソート機能**: 名前順、価格（安い順・高い順）

### 3. ショッピングカート
- **商品追加**: カートへの商品追加（ログイン必須）
- **数量変更**: +/- ボタンで数量調整
- **商品削除**: カートから商品を削除
- **合計表示**: 総額の自動計算
- **チェックアウト**: 購入処理のシミュレーション

### 4. ToDoリスト（お気に入り商品メモ）
- **メモ追加**: お気に入り商品のメモを追加（ログイン必須）
- **完了切り替え**: チェックボックスで完了状態を管理
- **メモ削除**: 不要なメモの削除

### 5. 言語切り替え機能
- **多言語対応**: 日本語（JP）と英語（EN）の切り替え
- **設定の永続化**: 選択した言語をlocalStorageに保存
- **全UI対応**: すべてのテキスト、メッセージ、商品名が翻訳対応
- **動的コンテンツ**: 商品一覧、カート、ToDoリストも言語切り替えに対応

## ファイル構成

```
shoptodo-app/
├── index.html      # メインHTML（アプリの構造）
├── styles.css      # スタイルシート（レスポンシブ対応）
├── app.js          # JavaScript（全機能の実装）
├── README.md       # 英語版説明書
└── README_jp.md    # 日本語版説明書（このファイル）
```

## 使用方法

### 1. アプリケーションの起動

ローカルサーバーで実行することをおすすめします：

```bash
# Python 3の場合
python -m http.server 8000

# Python 2の場合
python -m SimpleHTTPServer 8000

# Node.jsのhttp-serverを使用する場合
npx http-server
```

ブラウザで `http://localhost:8000` にアクセスしてください。

### 2. 基本的な操作フロー

1. **ログイン**
   - 「ログイン」ボタンをクリック
   - ユーザー名: `demo`、パスワード: `password` を入力
   - 「ログイン」ボタンでログイン

2. **商品閲覧・検索**
   - 商品一覧から気になる商品を探す
   - 検索ボックスで商品名を検索
   - カテゴリやソートでフィルタリング

3. **ショッピング**
   - 商品の「カートに追加」ボタンをクリック
   - サイドバーのカートで数量調整
   - 「チェックアウト」で購入手続き

4. **メモ管理**
   - ToDoリストにお気に入り商品のメモを追加
   - 完了チェックや削除も可能

5. **言語切り替え**
   - ヘッダーの「EN」「JP」ボタンで言語を切り替え
   - 設定は自動保存され、次回アクセス時も適用される

## E2Eテストのポイント

このアプリケーションは以下のテストシナリオに適しています：

### 認証フロー
- ログイン成功・失敗のテスト
- ログイン状態でのUI変化
- ログアウト機能

### 商品検索・フィルタ
- 検索機能の動作確認
- カテゴリフィルタの適用
- ソート機能の検証

### ショッピングカート
- 商品追加の動作
- 数量変更の確認
- カート内容の永続化
- チェックアウトプロセス

### ToDoリスト
- アイテム追加・削除
- 完了状態の切り替え
- データの永続化

### レスポンシブデザイン
- 異なる画面サイズでの表示確認
- モバイル表示での操作性

### 言語切り替え
- 日本語と英語の言語切り替え機能
- 翻訳されたUI要素の確認
- 言語設定の永続化テスト

## データ管理

- **localStorage**を使用してデータを永続化
- セッション情報、カート内容、ToDoリスト、言語設定を保存
- ページリロード後もデータが保持される

## 技術仕様

- **フロントエンド**: HTML5, CSS3, Vanilla JavaScript
- **データストレージ**: localStorage
- **レスポンシブ**: CSS Grid, Flexbox
- **多言語対応**: i18n オブジェクトによる翻訳管理
- **モダンブラウザ対応**: ES6+

## ブラウザサポート

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## カスタマイズ

### 商品データの変更
`app.js`の`initializeData()`メソッド内で商品データを編集できます。

### スタイルの調整
`styles.css`でデザインをカスタマイズできます。

### 新機能の追加
`app.js`の`AppState`と`UIManager`クラスを拡張して新機能を追加できます。

## テスト

このプロジェクトはJestを使用した包括的なユニットテストを含んでいます。

### テストの実行

まず、依存関係をインストールします：

```bash
npm install
```

すべてのテストを実行：

```bash
npm test
```

ウォッチモードでテストを実行（開発時）：

```bash
npm run test:watch
```

テストカバレッジレポートを生成：

```bash
npm run test:coverage
```

### テスト構成

```
tests/
├── setup.js              # Jest設定とモック
├── testUtils.js          # テストユーティリティとヘルパー
├── AppState.test.js      # AppStateクラスのユニットテスト
├── UIManager.test.js     # UIManagerクラスのユニットテスト
└── i18n.test.js          # 翻訳データの検証テスト
```

### テストカバレッジ

テストスイートは以下をカバーしています：

- **認証機能**: ログイン/ログアウト機能
- **カート管理**: 追加、削除、数量更新、合計計算
- **Todo管理**: 追加、切り替え、削除
- **商品フィルタリング**: 検索、カテゴリフィルタ、ソート
- **言語切り替え**: UI翻訳と永続化
- **データ永続化**: localStorage操作
- **翻訳データ**: i18nキーの整合性と完全性

目標カバレッジ: 分岐、関数、行、文について80%以上

## E2E自動化テスト

このプロジェクトには、Page Object Model + Cucumber BDDを使用した包括的なE2E自動化テストが含まれています。

### E2E自動化の構成

```
e2e/
├── features/                    # Gherkinフィーチャーファイル
│   ├── authentication.feature  # 認証テストシナリオ
│   ├── product-catalog.feature # 商品カタログテスト
│   ├── shopping-cart.feature   # ショッピングカート機能
│   ├── todo-list.feature       # ToDoリスト機能
│   ├── language-switching.feature # 言語切り替え
│   ├── data-persistence.feature # データ永続化
│   └── end-to-end-scenarios.feature # エンドツーエンドシナリオ
├── page-objects/               # Page Object Model
│   ├── BasePage.ts            # 共通ページオブジェクト
│   ├── LoginPage.ts           # ログインページ
│   ├── DashboardPage.ts       # メインダッシュボード
│   └── CartPage.ts            # カートページ
├── step-definitions/          # Cucumberステップ定義
│   ├── authentication.steps.ts # 認証ステップ
│   ├── product-catalog.steps.ts # 商品カタログステップ
│   ├── shopping-cart.steps.ts # カートステップ
│   └── common.steps.ts        # 共通ステップ
├── support/                   # テスト支援
│   ├── world.ts              # テスト実行環境
│   └── hooks.ts              # Before/Afterフック
├── data/                     # テストデータ
│   └── test-data.json        # テスト用データセット
└── utils/                    # ユーティリティ
    └── TestDataManager.ts    # テストデータ管理
```

### E2Eテストの実行方法

#### 1. E2E依存関係のインストール

```bash
cd e2e
npm install
npx playwright install
```

#### 2. アプリケーションサーバーの起動

別のターミナルでアプリケーションを起動：

```bash
# プロジェクトルートディレクトリで
npm run serve
```

#### 3. E2Eテストの実行

```bash
cd e2e

# スモークテスト（主要な機能のみ）
npm run test:e2e:smoke

# 回帰テスト（全機能）
npm run test:e2e:regression

# 並列実行（高速化）
npm run test:e2e:parallel

# デバッグ用テスト
npm run test:e2e:debug

# 全テスト実行
npm run test:e2e
```

#### 4. クロスブラウザテスト

```bash
# 特定のブラウザで実行
BROWSER=firefox npm run test:e2e
BROWSER=webkit npm run test:e2e

# ヘッドレスモード無効（ブラウザが表示される）
HEADLESS=false npm run test:e2e
```

### E2E自動化の特徴

#### Page Object Model (POM)
- **BasePage**: 共通機能（ナビゲーション、要素操作、スクリーンショット）
- **LoginPage**: ログイン機能の専用メソッド
- **DashboardPage**: メイン画面の全機能（商品、カート、ToDo、言語）
- **CartPage**: ショッピングカート専用機能

#### BDD（振る舞い駆動開発）
- **Gherkin形式**: Given-When-Thenで書かれた読みやすいテストシナリオ
- **ビジネス価値**: ステークホルダーも理解できる自然言語でのテスト記述
- **トレーサビリティ**: 要件からテストケースまでの完全な追跡可能性

#### テストデータ管理
- **TestDataManager**: 集約されたテストデータ管理
- **多言語対応**: 日本語・英語両方のテストデータ
- **型安全性**: TypeScriptによる型チェック

### 自動化カバレッジ

| 機能カテゴリ | テストケース数 | 自動化率 |
|-------------|---------------|----------|
| 認証機能 | 9 | 100% |
| 商品カタログ | 19 | 100% |
| ショッピングカート | 13 | 100% |
| ToDoリスト | 8 | 100% |
| 言語切り替え | 5 | 100% |
| データ永続化 | 4 | 100% |
| **合計** | **58** | **100%** |

### CI/CD統合

GitHub Actionsによる自動テスト実行：

```yaml
# 自動実行タイミング
- Push/Pull Request時
- 毎日午前2時（スケジュール実行）
- 手動実行

# サポートブラウザ
- Chromium
- Firefox
- WebKit (Safari)

# テストタイプ
- スモークテスト
- 回帰テスト
- パフォーマンステスト（Lighthouse）
```

### テストレポート

テスト実行後、以下のレポートが生成されます：

- **Cucumber HTML Report**: `e2e/reports/cucumber-report.html`
- **Playwright Report**: `e2e/playwright-report/`
- **Screenshots**: `e2e/screenshots/`（失敗時）
- **GitHub Actions**: CI実行結果とアーティファクト

### ISTQB準拠テスト文書

プロフェッショナルなテストプロセス文書も含まれています：

```
docs/
├── test-planning/
│   ├── test-strategy.md        # テスト戦略書
│   ├── test-plan.md           # テスト計画書
│   └── risk-analysis.md       # リスク分析書
├── test-analysis/
│   ├── requirements-analysis.md # 要件分析書
│   └── test-observation-matrix.md # テスト観点表
└── test-design/
    ├── user-stories.md        # ユーザーストーリー
    ├── test-scenarios.md      # テストシナリオ
    ├── test-cases.md          # テストケース
    └── traceability-matrix.md # トレーサビリティマトリックス
```

### エラー処理とデバッグ

- **自動スクリーンショット**: テスト失敗時に自動撮影
- **詳細ログ**: ステップごとの実行ログ
- **リトライ機能**: 不安定なテストの自動再実行
- **タイムアウト設定**: 要素待機の適切な設定

## 注意事項

- このアプリケーションは**教育・テスト目的**のみです
- 実際の決済機能は含まれていません
- データはブラウザのlocalStorageに保存されます
- セキュリティ機能は最小限です

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。学習・テスト目的での自由な使用が可能です。