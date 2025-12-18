// Recommended Products unit tests

const { AppState } = require('../app.js');

describe('Recommended Products', () => {
  let appState;

  beforeEach(() => {
    appState = new AppState();
  });

  describe('getRecommendedProducts', () => {
    test('should return exactly 4 products (one from each category)', () => {
      const recommended = appState.getRecommendedProducts();

      expect(recommended).toHaveLength(4);
    });

    test('should return one product from each category', () => {
      const recommended = appState.getRecommendedProducts();
      const categories = recommended.map(p => p.category);

      expect(categories).toContain('electronics');
      expect(categories).toContain('clothing');
      expect(categories).toContain('books');
      expect(categories).toContain('home');
    });

    test('should return unique products (no duplicates)', () => {
      const recommended = appState.getRecommendedProducts();
      const ids = recommended.map(p => p.id);
      const uniqueIds = [...new Set(ids)];

      expect(uniqueIds).toHaveLength(ids.length);
    });

    test('should return products with required properties', () => {
      const recommended = appState.getRecommendedProducts();

      recommended.forEach(product => {
        expect(product).toHaveProperty('id');
        expect(product).toHaveProperty('name');
        expect(product).toHaveProperty('price');
        expect(product).toHaveProperty('category');
        expect(product).toHaveProperty('image');
      });
    });

    test('should return the first product from each category', () => {
      const recommended = appState.getRecommendedProducts();

      // Get the first product of each category from the products array
      const categories = ['electronics', 'clothing', 'books', 'home'];

      categories.forEach(category => {
        const firstInCategory = appState.products.find(p => p.category === category);
        const recommendedInCategory = recommended.find(p => p.category === category);

        expect(recommendedInCategory.id).toBe(firstInCategory.id);
      });
    });

    test('should handle empty products gracefully', () => {
      // Create a new AppState and clear products
      const emptyAppState = new AppState();
      emptyAppState.products = [];

      const recommended = emptyAppState.getRecommendedProducts();

      expect(recommended).toEqual([]);
    });

    test('should handle missing category gracefully', () => {
      // Create AppState with only electronics products
      const partialAppState = new AppState();
      partialAppState.products = partialAppState.products.filter(p => p.category === 'electronics');

      const recommended = partialAppState.getRecommendedProducts();

      expect(recommended).toHaveLength(1);
      expect(recommended[0].category).toBe('electronics');
    });
  });
});
