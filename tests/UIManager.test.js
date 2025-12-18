// UIManager class unit tests

const { AppState, UIManager, i18n } = require('../app.js');
const { createSampleProducts, setupLocalStorageWithData, createElement } = require('./testUtils.js');

describe('UIManager', () => {
  let appState;
  let uiManager;

  beforeEach(() => {
    appState = new AppState();

    // Create UIManager without calling the constructor's DOM initialization
    uiManager = Object.create(UIManager.prototype);
    uiManager.appState = appState;

    // Mock DOM methods
    uiManager.renderProducts = jest.fn();
    uiManager.renderRecommendedProducts = jest.fn();
    uiManager.renderCart = jest.fn();
    uiManager.renderTodos = jest.fn();
    uiManager.updateAuthUI = jest.fn();

    document.querySelectorAll = jest.fn((selector) => {
      if (selector === '.lang-btn') {
        return [
          { classList: { remove: jest.fn() } },
          { classList: { remove: jest.fn() } }
        ];
      }
      if (selector === '[data-i18n]') {
        return [
          {
            getAttribute: jest.fn((attr) => attr === 'data-i18n' ? 'login' : null),
            textContent: '',
            setAttribute: jest.fn()
          },
          {
            getAttribute: jest.fn((attr) => attr === 'data-i18n' ? 'logout' : null),
            textContent: '',
            setAttribute: jest.fn()
          }
        ];
      }
      if (selector === '[data-i18n-placeholder]') {
        return [
          { getAttribute: jest.fn(() => 'search_placeholder'), setAttribute: jest.fn() }
        ];
      }
      return [];
    });

    document.getElementById = jest.fn((id) => {
      return {
        classList: { add: jest.fn() }
      };
    });

    document.documentElement = {
      lang: 'ja'
    };
  });

  describe('constructor', () => {
    test('should initialize with AppState', () => {
      expect(uiManager.appState).toBe(appState);
    });
  });

  describe('language switching', () => {
    test('should switch language and update UI', () => {
      const updateLanguageUISpy = jest.spyOn(uiManager, 'updateLanguageUI');
      const updateUISpy = jest.spyOn(uiManager, 'updateUI');

      uiManager.switchLanguage('en');

      expect(appState.currentLanguage).toBe('en');
      expect(updateLanguageUISpy).toHaveBeenCalled();
      expect(updateUISpy).toHaveBeenCalled();
    });

    test('should update active language button', () => {
      const mockLangButtons = [
        { classList: { remove: jest.fn() } },
        { classList: { remove: jest.fn() } }
      ];
      const mockActiveButton = { classList: { add: jest.fn() } };

      document.querySelectorAll.mockImplementation((selector) => {
        if (selector === '.lang-btn') return mockLangButtons;
        if (selector === '[data-i18n]') return [];
        if (selector === '[data-i18n-placeholder]') return [];
        return [];
      });
      document.getElementById.mockReturnValue(mockActiveButton);

      uiManager.updateLanguageUI();

      expect(mockLangButtons[0].classList.remove).toHaveBeenCalledWith('active');
      expect(mockLangButtons[1].classList.remove).toHaveBeenCalledWith('active');
      expect(mockActiveButton.classList.add).toHaveBeenCalledWith('active');
    });

    test('should update document language attribute', () => {
      appState.currentLanguage = 'en';

      uiManager.updateLanguageUI();

      expect(document.documentElement.lang).toBe('en');
    });

    test('should translate elements with data-i18n attribute', () => {
      const mockElements = [
        { getAttribute: jest.fn(() => 'login'), textContent: '' },
        { getAttribute: jest.fn(() => 'logout'), textContent: '' }
      ];

      document.querySelectorAll.mockImplementation((selector) => {
        if (selector === '[data-i18n]') return mockElements;
        if (selector === '.lang-btn') return [];
        if (selector === '[data-i18n-placeholder]') return [];
        return [];
      });

      appState.currentLanguage = 'en';

      uiManager.updateLanguageUI();

      expect(mockElements[0].textContent).toBe('Login');
      expect(mockElements[1].textContent).toBe('Logout');
    });

    test('should update placeholder attributes', () => {
      const mockElements = [
        { getAttribute: jest.fn(() => 'search_placeholder'), setAttribute: jest.fn() }
      ];

      document.querySelectorAll.mockImplementation((selector) => {
        if (selector === '[data-i18n-placeholder]') return mockElements;
        if (selector === '.lang-btn') return [];
        if (selector === '[data-i18n]') return [];
        return [];
      });

      appState.currentLanguage = 'en';

      uiManager.updateLanguageUI();

      expect(mockElements[0].setAttribute).toHaveBeenCalledWith('placeholder', 'Search products...');
    });
  });

  describe('translation helper', () => {
    test('should return translation for current language', () => {
      appState.currentLanguage = 'en';

      const result = uiManager.t('login');

      expect(result).toBe('Login');
    });

    test('should return translation for Japanese', () => {
      appState.currentLanguage = 'ja';

      const result = uiManager.t('login');

      expect(result).toBe('ログイン');
    });

    test('should return key if translation not found', () => {
      const result = uiManager.t('nonexistent_key');

      expect(result).toBe('nonexistent_key');
    });
  });

  describe('product name translation', () => {
    test('should return English name when language is English', () => {
      appState.currentLanguage = 'en';

      const result = uiManager.getProductName('スマートフォン');

      expect(result).toBe('Smartphone');
    });

    test('should return original name when language is Japanese', () => {
      appState.currentLanguage = 'ja';

      const result = uiManager.getProductName('スマートフォン');

      expect(result).toBe('スマートフォン');
    });

    test('should return original name when translation not found', () => {
      appState.currentLanguage = 'en';

      const result = uiManager.getProductName('Unknown Product');

      expect(result).toBe('Unknown Product');
    });
  });

  describe('category name translation', () => {
    test('should translate category names', () => {
      appState.currentLanguage = 'en';

      expect(uiManager.getCategoryName('electronics')).toBe('Electronics');
      expect(uiManager.getCategoryName('clothing')).toBe('Clothing');
      expect(uiManager.getCategoryName('books')).toBe('Books');
      expect(uiManager.getCategoryName('home')).toBe('Home');
    });

    test('should translate category names in Japanese', () => {
      appState.currentLanguage = 'ja';

      expect(uiManager.getCategoryName('electronics')).toBe('電子機器');
      expect(uiManager.getCategoryName('clothing')).toBe('衣類');
      expect(uiManager.getCategoryName('books')).toBe('書籍');
      expect(uiManager.getCategoryName('home')).toBe('ホーム');
    });
  });

  describe('message display', () => {
    test('should display success message', () => {
      const mockMessageDiv = {
        className: '',
        style: {
          cssText: ''
        },
        textContent: '',
        remove: jest.fn(),
        setAttribute: jest.fn()
      };

      document.createElement = jest.fn(() => mockMessageDiv);
      document.body.appendChild = jest.fn();
      document.querySelector = jest.fn(() => null);

      global.setTimeout = jest.fn((callback) => callback());

      uiManager.showMessage('Test message', 'success');

      expect(document.createElement).toHaveBeenCalledWith('div');
      expect(mockMessageDiv.className).toBe('message message-success');
      expect(mockMessageDiv.textContent).toBe('Test message');
      expect(mockMessageDiv.setAttribute).toHaveBeenCalledWith('role', 'status');
      expect(mockMessageDiv.setAttribute).toHaveBeenCalledWith('aria-live', 'polite');
      expect(document.body.appendChild).toHaveBeenCalledWith(mockMessageDiv);
    });

    test('should remove existing message before showing new one', () => {
      const existingMessage = {
        remove: jest.fn()
      };

      document.querySelector = jest.fn(() => existingMessage);
      document.createElement = jest.fn(() => ({
        className: '',
        style: { cssText: '' },
        textContent: '',
        remove: jest.fn(),
        setAttribute: jest.fn()
      }));
      document.body.appendChild = jest.fn();

      uiManager.showMessage('Test message');

      expect(existingMessage.remove).toHaveBeenCalled();
    });
  });

  describe('UI update methods', () => {
    test('should call all update methods', () => {
      const updateLanguageUISpy = jest.spyOn(uiManager, 'updateLanguageUI');
      const updateAuthUISpy = jest.spyOn(uiManager, 'updateAuthUI');

      uiManager.updateUI();

      expect(updateLanguageUISpy).toHaveBeenCalled();
      expect(updateAuthUISpy).toHaveBeenCalled();
      expect(uiManager.renderRecommendedProducts).toHaveBeenCalled();
      expect(uiManager.renderProducts).toHaveBeenCalled();
      expect(uiManager.renderCart).toHaveBeenCalled();
      expect(uiManager.renderTodos).toHaveBeenCalled();
    });
  });
});