# ShopTodo - E2Eテスト練習用Webアプリケーション

E2E（End-to-End）テストの練習に最適なシンプルなWebアプリケーションです。

**作成日: 2025年9月28日**

## 🌐 デモサイト

**今すぐ試す: [https://toasagi.github.io/shoptodo-app/](https://toasagi.github.io/shoptodo-app/)**

GitHub Pagesに自動デプロイされており、誰でもE2Eテストの練習に利用できます！

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
- **チェックアウト**: 完全なチェックアウトプロセスと注文処理

### 4. チェックアウトプロセス（新機能！）
- **マルチステップウィザード**: 3ステップのチェックアウトフロー（配送先 → 支払い → 確認）
- **配送先情報**: 名前、メール、電話番号、郵便番号、住所の入力
- **支払い方法**: クレジットカード、銀行振込、代金引換から選択
- **注文確認**: 注文内容の最終確認画面
- **注文完了**: 注文番号の生成と確認画面

### 5. 注文履歴（新機能！）
- **注文管理**: 過去の全注文を表示
- **注文詳細**: 注文番号、日付、商品、合計金額、配送先、支払い方法を表示
- **永続化**: localStorageに注文データを保存
- **時系列表示**: 最新の注文から順に表示

### 6. ToDoリスト（お気に入り商品メモ）
- **メモ追加**: お気に入り商品のメモを追加（ログイン必須）
- **完了切り替え**: チェックボックスで完了状態を管理
- **メモ削除**: 不要なメモの削除

### 7. 言語切り替え機能
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

このプロジェクトには、Cucumber BDD + Playwrightを使用したログイン機能のE2E自動化テストが含まれています。

### E2Eテストの構成

```
e2e/
├── features/                    # Gherkinフィーチャーファイル
│   ├── login.feature           # ログインテストシナリオ
│   └── simple.feature          # 基本接続テスト
├── page-objects/               # Page Object Model
│   ├── LoginPage.ts           # ログインページメソッド
│   └── DashboardPage.ts       # ダッシュボードページメソッド
├── step-definitions/          # Cucumberステップ定義
│   ├── login.steps.ts         # ログインステップ定義
│   └── simple.steps.ts        # シンプルテストステップ
├── support/                   # テスト支援
│   ├── world.ts              # テスト実行環境
│   └── hooks.ts              # Before/Afterフック
├── screenshots/              # テスト失敗時のスクリーンショット（gitignored）
├── reports/                  # テストレポート
├── package.json             # 依存関係とスクリプト
├── cucumber.config.js       # Cucumber設定
├── tsconfig.json           # TypeScript設定
└── README.md               # E2Eテストドキュメント
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
python3 -m http.server 8000
```

#### 3. E2Eテストの実行

```bash
cd e2e

# 全ログインテスト実行
npm test

# スモークテスト（主要なログイン機能）
npm run test:smoke

# ネガティブテスト（エラーシナリオ）
npm run test:negative

# デバッグテスト（基本接続テスト）
npm run test:debug
```

#### 4. クロスブラウザテスト

```bash
# 特定のブラウザで実行
BROWSER=firefox npm test
BROWSER=webkit npm test

# ヘッドレスモード無効（ブラウザが表示される）
HEADLESS=false npm test
```

### E2Eテストの特徴

#### 現在のテストカバレッジ
- **ログイン機能**: 完全なログインフローのテスト
  - 有効な資格情報でのログイン成功
  - 無効な資格情報でのログイン失敗
  - 空フィールドバリデーション
  - ログアウト機能
- **基本接続**: アプリケーション可用性の確認

#### 使用技術
- **Cucumber BDD**: Gherkin形式での自然言語テストシナリオ
- **Playwright**: クロスブラウザ自動化（Chromium、Firefox、WebKit）
- **TypeScript**: 型安全なテストコード
- **Page Object Model**: メンテナンス可能なテスト構造

#### テスト設定
- **環境変数**:
  - `APP_URL`: アプリケーションURL（デフォルト: http://localhost:8000）
  - `BROWSER`: ブラウザ選択（chromium/firefox/webkit）
  - `HEADLESS`: ヘッドレスモード制御
  - `TIMEOUT`: テストタイムアウト設定

詳細なE2Eテストドキュメントは [e2e/README.md](e2e/README.md) を参照してください。

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

## デプロイ

このアプリケーションはGitHub Actionsを使用してGitHub Pagesに自動デプロイされています。

### デプロイワークフロー

1. **開発**: フィーチャーブランチを作成して変更を加える
2. **Pull Request**: `main`ブランチへのPRを作成
3. **レビュー**: コードレビューと承認（ブランチ保護が有効な場合）
4. **マージ**: PRを`main`にマージ
5. **自動デプロイ**: GitHub Actionsが自動的にGitHub Pagesにデプロイ

### デプロイ設定

`main`ブランチに変更がプッシュされたときに自動的にデプロイがトリガーされます：

```yaml
on:
  push:
    branches: [main]
```

**公開URL**: [https://toasagi.github.io/shoptodo-app/](https://toasagi.github.io/shoptodo-app/)

### ブランチ保護設定（推奨）

`main`への直接プッシュを防止し、すべての変更をPR経由にするため：

1. **Settings** > **Branches** を開く
2. ブランチ名パターン `main` のルールを**追加**
3. 以下を有効化：
   - ☑ Require pull request before merging
   - ☑ Require approvals（任意）

これにより、品質管理とコードレビュー後の自動デプロイが保証されます。

## 注意事項

- このアプリケーションは**教育・テスト目的**のみです
- 実際の決済機能は含まれていません
- データはブラウザのlocalStorageに保存されます
- セキュリティ機能は最小限です

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。学習・テスト目的での自由な使用が可能です。