# Security Test Suite

OWASP Web Security Testing Guide (WSTG) v4.2 に準拠したセキュリティテストスイートです。

## 概要

このテストスイートは、ShopTodo アプリケーションのセキュリティ脆弱性を文書化し、検証するために設計されています。

## テストカテゴリ

| カテゴリ | 説明 | 深刻度 | テスト数 |
|---------|------|--------|---------|
| WSTG-INPV | 入力検証 (XSS) | Critical | 2 |
| WSTG-ATHN | 認証テスト | High | 2 |
| WSTG-BUSL | ビジネスロジック | High | 2 |
| WSTG-CLNT | クライアントサイド | High | 2 |
| WSTG-SESS | セッション管理 | Medium | 1 |
| WSTG-CONF | 設定管理 | Medium | 2 |

## フォルダ構造

```
tests/security/
├── README.md
├── WSTG-INPV/                   # 入力検証 (Critical)
│   ├── inpv-01-xss-stored.test.js
│   └── inpv-02-xss-dom-based.test.js
├── WSTG-ATHN/                   # 認証テスト (High)
│   ├── athn-01-credentials.test.js
│   └── athn-02-password-storage.test.js
├── WSTG-BUSL/                   # ビジネスロジック (High)
│   ├── busl-01-cart-manipulation.test.js
│   └── busl-02-checkout-bypass.test.js
├── WSTG-CLNT/                   # クライアントサイド (High)
│   ├── clnt-01-localstorage-security.test.js
│   └── clnt-02-clickjacking.test.js
├── WSTG-SESS/                   # セッション管理 (Medium)
│   └── sess-01-session-management.test.js
├── WSTG-CONF/                   # 設定管理 (Medium)
│   ├── conf-01-cdn-integrity.test.js
│   └── conf-02-error-handling.test.js
└── utils/
    ├── security-test-helpers.js
    └── xss-payloads.js
```

## 実行方法

```bash
# 全セキュリティテスト実行
npm run test:security

# カテゴリ別実行
npm run test:security:critical   # XSS (Critical)
npm run test:security:auth       # 認証 (High)
npm run test:security:business   # ビジネスロジック (High)
npm run test:security:client     # クライアントサイド (High)
npm run test:security:session    # セッション (Medium)
npm run test:security:config     # 設定 (Medium)
```

## 発見された脆弱性

### Critical (即座に対応が必要)

#### ~~V1: Stored XSS via innerHTML~~ ✅ FIXED
- **場所**: `app.js` (複数箇所)
- **影響**: Todo、カート、注文履歴での任意のJavaScript実行
- **対策**: ✅ `escapeHTML()` 関数を実装し、全ユーザー入力をエスケープ
- **修正日**: Issue #33

### High (早急な対応が必要)

#### V2: ハードコード認証情報
- **場所**: `app.js:448`
- **認証情報**: `demo` / `password`
- **影響**: 誰でもログイン可能
- **対策**: サーバーサイド認証の実装

#### V3: 価格改ざん脆弱性
- **場所**: カート処理 (localStorage)
- **影響**: 商品価格を任意の値に変更可能
- **対策**: サーバーサイドでの価格検証

#### V4: セッションハイジャック
- **場所**: localStorage `currentUser`
- **影響**: 任意のユーザーとしてログイン可能
- **対策**: セキュアなセッショントークンの使用

#### V5: PII平文保存
- **場所**: localStorage `orders`
- **影響**: 個人情報の露出リスク
- **対策**: 機密データの暗号化

### Medium (計画的な対応)

#### V6: SRI未設定
- **場所**: `index.html` CDNリソース
- **影響**: CDN侵害時のリスク
- **対策**: Subresource Integrity (SRI) 属性の追加

#### V7: クリックジャッキング保護なし
- **場所**: アプリケーション全体
- **影響**: UI リドレス攻撃のリスク
- **対策**: X-Frame-Options または CSP frame-ancestors の設定

## テスト結果の解釈

テストは以下のパターンで分類されています:

- `VULNERABILITY:` - 確認された脆弱性
- `GOOD:` - 適切に実装されている機能
- `PARTIAL:` - 一部対策済みだが改善の余地あり
- `Document:` - 文書化目的（推奨事項）

## 参考資料

- [OWASP Web Security Testing Guide v4.2](https://owasp.org/www-project-web-security-testing-guide/v42/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)

## 注意事項

このテストスイートは教育目的およびセキュリティ監査用に設計されています。
本番環境では、発見された脆弱性に対して適切な対策を実施してください。
