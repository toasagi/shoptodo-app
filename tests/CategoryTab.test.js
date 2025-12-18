// Category Tab unit tests

const { AppState } = require('../app.js');

describe('Category Tab', () => {
  let appState;

  beforeEach(() => {
    appState = new AppState();
  });

  describe('currentCategory state', () => {
    test('should initialize with empty string (all categories)', () => {
      expect(appState.currentCategory).toBe('');
    });

    test('should set category using setCategory method', () => {
      appState.setCategory('electronics');

      expect(appState.currentCategory).toBe('electronics');
    });

    test('should allow setting back to all categories', () => {
      appState.setCategory('electronics');
      appState.setCategory('');

      expect(appState.currentCategory).toBe('');
    });
  });

  describe('category filtering', () => {
    test('should show all products when category is empty', () => {
      appState.filterProducts('', '', 'name');

      expect(appState.filteredProducts.length).toBe(appState.products.length);
    });

    test('should filter by electronics category', () => {
      appState.filterProducts('', 'electronics', 'name');

      expect(appState.filteredProducts.length).toBeGreaterThan(0);
      appState.filteredProducts.forEach(product => {
        expect(product.category).toBe('electronics');
      });
    });

    test('should filter by clothing category', () => {
      appState.filterProducts('', 'clothing', 'name');

      expect(appState.filteredProducts.length).toBeGreaterThan(0);
      appState.filteredProducts.forEach(product => {
        expect(product.category).toBe('clothing');
      });
    });

    test('should filter by books category', () => {
      appState.filterProducts('', 'books', 'name');

      expect(appState.filteredProducts.length).toBeGreaterThan(0);
      appState.filteredProducts.forEach(product => {
        expect(product.category).toBe('books');
      });
    });

    test('should filter by home category', () => {
      appState.filterProducts('', 'home', 'name');

      expect(appState.filteredProducts.length).toBeGreaterThan(0);
      appState.filteredProducts.forEach(product => {
        expect(product.category).toBe('home');
      });
    });
  });

  describe('category with search combination', () => {
    test('should filter by category and search term together', () => {
      // Filter by electronics and search for a term
      appState.filterProducts('スマート', 'electronics', 'name');

      expect(appState.filteredProducts.length).toBeGreaterThan(0);
      appState.filteredProducts.forEach(product => {
        expect(product.category).toBe('electronics');
        expect(product.name.toLowerCase()).toContain('スマート');
      });
    });

    test('should return empty when search term does not match category', () => {
      // Search for clothing term in electronics category
      appState.filterProducts('Tシャツ', 'electronics', 'name');

      expect(appState.filteredProducts.length).toBe(0);
    });
  });

  describe('category with sort combination', () => {
    test('should sort filtered category by price low to high', () => {
      appState.filterProducts('', 'electronics', 'price-low');

      expect(appState.filteredProducts.length).toBeGreaterThan(0);

      for (let i = 1; i < appState.filteredProducts.length; i++) {
        expect(appState.filteredProducts[i].price).toBeGreaterThanOrEqual(
          appState.filteredProducts[i - 1].price
        );
      }
    });

    test('should sort filtered category by price high to low', () => {
      appState.filterProducts('', 'books', 'price-high');

      expect(appState.filteredProducts.length).toBeGreaterThan(0);

      for (let i = 1; i < appState.filteredProducts.length; i++) {
        expect(appState.filteredProducts[i].price).toBeLessThanOrEqual(
          appState.filteredProducts[i - 1].price
        );
      }
    });

    test('should sort filtered category by name', () => {
      appState.filterProducts('', 'clothing', 'name');

      expect(appState.filteredProducts.length).toBeGreaterThan(0);

      for (let i = 1; i < appState.filteredProducts.length; i++) {
        expect(
          appState.filteredProducts[i].name.localeCompare(
            appState.filteredProducts[i - 1].name
          )
        ).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('category product counts', () => {
    test('should have products in all categories', () => {
      const categories = ['electronics', 'clothing', 'books', 'home'];

      categories.forEach(category => {
        appState.filterProducts('', category, 'name');
        expect(appState.filteredProducts.length).toBeGreaterThan(0);
      });
    });

    test('should have correct total when summing all categories', () => {
      const categories = ['electronics', 'clothing', 'books', 'home'];
      let totalCount = 0;

      categories.forEach(category => {
        appState.filterProducts('', category, 'name');
        totalCount += appState.filteredProducts.length;
      });

      expect(totalCount).toBe(appState.products.length);
    });
  });
});
