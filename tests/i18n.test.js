// i18n translation data unit tests

const { i18n } = require('../app.js');

describe('i18n translation data', () => {
  describe('structure validation', () => {
    test('should have both ja and en languages', () => {
      expect(i18n).toHaveProperty('ja');
      expect(i18n).toHaveProperty('en');
      expect(typeof i18n.ja).toBe('object');
      expect(typeof i18n.en).toBe('object');
    });

    test('should have product_names object in both languages', () => {
      expect(i18n.ja).toHaveProperty('product_names');
      expect(i18n.en).toHaveProperty('product_names');
      expect(typeof i18n.ja.product_names).toBe('object');
      expect(typeof i18n.en.product_names).toBe('object');
    });
  });

  describe('key consistency', () => {
    test('should have same keys in both languages (excluding product_names)', () => {
      const jaKeys = Object.keys(i18n.ja).filter(key => key !== 'product_names').sort();
      const enKeys = Object.keys(i18n.en).filter(key => key !== 'product_names').sort();

      expect(jaKeys).toEqual(enKeys);
    });

    test('should have same product names in both languages', () => {
      const jaProductNames = Object.keys(i18n.ja.product_names).sort();
      const enProductNames = Object.keys(i18n.en.product_names).sort();

      expect(jaProductNames).toEqual(enProductNames);
    });

    test('should not have empty translation values', () => {
      const checkEmptyValues = (obj, lang) => {
        Object.entries(obj).forEach(([key, value]) => {
          if (typeof value === 'string') {
            expect(value.trim()).not.toBe('');
          } else if (typeof value === 'object') {
            checkEmptyValues(value, lang);
          }
        });
      };

      checkEmptyValues(i18n.ja, 'ja');
      checkEmptyValues(i18n.en, 'en');
    });
  });

  describe('required keys existence', () => {
    const requiredKeys = [
      'title',
      'login',
      'logout',
      'username',
      'password',
      'demo_info',
      'product_catalog',
      'search_placeholder',
      'all_categories',
      'electronics',
      'clothing',
      'books',
      'home',
      'sort_name',
      'sort_price_low',
      'sort_price_high',
      'shopping_cart',
      'cart_empty',
      'checkout',
      'favorite_memo',
      'memo_placeholder',
      'add',
      'footer_text',
      'add_to_cart',
      'product_image',
      'total',
      'memo_empty',
      'login_required',
      'product_added',
      'product_removed',
      'memo_added',
      'memo_deleted',
      'login_success',
      'logout_success',
      'login_error',
      'checkout_confirm',
      'checkout_success',
      'complete',
      'incomplete',
      'delete'
    ];

    test.each(requiredKeys)('should have %s key in both languages', (key) => {
      expect(i18n.ja).toHaveProperty(key);
      expect(i18n.en).toHaveProperty(key);
      expect(typeof i18n.ja[key]).toBe('string');
      expect(typeof i18n.en[key]).toBe('string');
    });
  });

  describe('product names translation', () => {
    const expectedProducts = [
      'スマートフォン',
      'ノートパソコン',
      'Tシャツ',
      'ジーンズ',
      'プログラミング入門書',
      'JavaScript完全ガイド',
      'コーヒーメーカー',
      '掃除機',
      'ワイヤレスイヤホン',
      'スニーカー',
      'Web開発の教科書',
      'キッチン用品セット'
    ];

    test.each(expectedProducts)('should have translation for product: %s', (productName) => {
      expect(i18n.ja.product_names).toHaveProperty(productName);
      expect(i18n.en.product_names).toHaveProperty(productName);
      expect(typeof i18n.ja.product_names[productName]).toBe('string');
      expect(typeof i18n.en.product_names[productName]).toBe('string');
    });

    test('should have English translations for all Japanese product names', () => {
      Object.entries(i18n.ja.product_names).forEach(([jaName, enName]) => {
        expect(enName).toBe(i18n.en.product_names[jaName]);
        expect(enName).not.toBe(jaName); // Should be translated, not the same
      });
    });
  });

  describe('translation quality', () => {
    test('should have appropriate Japanese translations', () => {
      expect(i18n.ja.login).toBe('ログイン');
      expect(i18n.ja.logout).toBe('ログアウト');
      expect(i18n.ja.shopping_cart).toBe('ショッピングカート');
      expect(i18n.ja.electronics).toBe('電子機器');
      expect(i18n.ja.clothing).toBe('衣類');
      expect(i18n.ja.books).toBe('書籍');
      expect(i18n.ja.home).toBe('ホーム');
    });

    test('should have appropriate English translations', () => {
      expect(i18n.en.login).toBe('Login');
      expect(i18n.en.logout).toBe('Logout');
      expect(i18n.en.shopping_cart).toBe('Shopping Cart');
      expect(i18n.en.electronics).toBe('Electronics');
      expect(i18n.en.clothing).toBe('Clothing');
      expect(i18n.en.books).toBe('Books');
      expect(i18n.en.home).toBe('Home');
    });

    test('should have consistent formatting', () => {
      // Check that copyright text follows expected format
      expect(i18n.ja.footer_text).toMatch(/© \d{4} ShopTodo/);
      expect(i18n.en.footer_text).toMatch(/© \d{4} ShopTodo/);

      // Check that placeholder texts end appropriately
      expect(i18n.ja.search_placeholder).toMatch(/\.{3}$/);
      expect(i18n.en.search_placeholder).toMatch(/\.{3}$/);
      expect(i18n.ja.memo_placeholder).toMatch(/\.{3}$/);
      expect(i18n.en.memo_placeholder).toMatch(/\.{3}$/);
    });
  });

  describe('message consistency', () => {
    test('should have consistent message types', () => {
      // Success messages should be positive
      expect(i18n.ja.login_success).toContain('しました');
      expect(i18n.en.login_success).toMatch(/successfully|completed/i);

      expect(i18n.ja.logout_success).toContain('しました');
      expect(i18n.en.logout_success).toMatch(/successfully|completed/i);

      // Error messages should be clear
      expect(i18n.ja.login_error).toContain('正しくありません');
      expect(i18n.en.login_error).toMatch(/invalid|incorrect/i);

      // Requirement messages should be clear
      expect(i18n.ja.login_required).toContain('ログイン');
      expect(i18n.en.login_required).toMatch(/login|please/i);
    });
  });

  describe('category and sorting options', () => {
    test('should have all required category options', () => {
      const categories = ['electronics', 'clothing', 'books', 'home'];

      categories.forEach(category => {
        expect(i18n.ja).toHaveProperty(category);
        expect(i18n.en).toHaveProperty(category);
      });
    });

    test('should have all required sorting options', () => {
      const sortOptions = ['sort_name', 'sort_price_low', 'sort_price_high'];

      sortOptions.forEach(option => {
        expect(i18n.ja).toHaveProperty(option);
        expect(i18n.en).toHaveProperty(option);
      });

      // Check Japanese sort options contain appropriate text
      expect(i18n.ja.sort_name).toContain('名前');
      expect(i18n.ja.sort_price_low).toContain('価格');
      expect(i18n.ja.sort_price_low).toContain('安い');
      expect(i18n.ja.sort_price_high).toContain('価格');
      expect(i18n.ja.sort_price_high).toContain('高い');

      // Check English sort options
      expect(i18n.en.sort_name).toMatch(/name/i);
      expect(i18n.en.sort_price_low).toMatch(/price.*low.*high/i);
      expect(i18n.en.sort_price_high).toMatch(/price.*high.*low/i);
    });
  });
});