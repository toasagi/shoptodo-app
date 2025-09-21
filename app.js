// 多言語対応
const i18n = {
    ja: {
        title: 'ShopTodo - E2Eテスト練習用アプリ',
        login: 'ログイン',
        logout: 'ログアウト',
        username: 'ユーザー名:',
        password: 'パスワード:',
        demo_info: 'デモ用: ユーザー名「demo」、パスワード「password」でログインできます',
        product_catalog: '商品カタログ',
        search_placeholder: '商品を検索...',
        all_categories: 'すべてのカテゴリ',
        electronics: '電子機器',
        clothing: '衣類',
        books: '書籍',
        home: 'ホーム',
        sort_name: '名前順',
        sort_price_low: '価格（安い順）',
        sort_price_high: '価格（高い順）',
        shopping_cart: 'ショッピングカート',
        cart_empty: 'カートは空です',
        checkout: 'チェックアウト',
        favorite_memo: 'お気に入り商品メモ',
        memo_placeholder: 'メモを追加...',
        add: '追加',
        footer_text: '© 2025 ShopTodo - E2Eテスト練習用アプリケーション',
        add_to_cart: 'カートに追加',
        product_image: '商品画像',
        total: '合計',
        memo_empty: 'メモはありません',
        login_required: 'ログインしてください',
        product_added: '商品をカートに追加しました',
        product_removed: '商品をカートから削除しました',
        memo_added: 'メモを追加しました',
        memo_deleted: 'メモを削除しました',
        login_success: 'ログインしました',
        logout_success: 'ログアウトしました',
        login_error: 'ユーザー名またはパスワードが正しくありません',
        checkout_confirm: 'でチェックアウトしますか？',
        checkout_success: 'チェックアウトが完了しました',
        complete: '完了にする',
        incomplete: '未完了にする',
        delete: '削除',
        product_names: {
            'スマートフォン': 'Smartphone',
            'ノートパソコン': 'Laptop',
            'Tシャツ': 'T-shirt',
            'ジーンズ': 'Jeans',
            'プログラミング入門書': 'Programming Basics',
            'JavaScript完全ガイド': 'JavaScript Complete Guide',
            'コーヒーメーカー': 'Coffee Maker',
            '掃除機': 'Vacuum Cleaner',
            'ワイヤレスイヤホン': 'Wireless Earphones',
            'スニーカー': 'Sneakers',
            'Web開発の教科書': 'Web Development Textbook',
            'キッチン用品セット': 'Kitchen Set'
        }
    },
    en: {
        title: 'ShopTodo - E2E Test Practice App',
        login: 'Login',
        logout: 'Logout',
        username: 'Username:',
        password: 'Password:',
        demo_info: 'Demo: Use username "demo" and password "password" to login',
        product_catalog: 'Product Catalog',
        search_placeholder: 'Search products...',
        all_categories: 'All Categories',
        electronics: 'Electronics',
        clothing: 'Clothing',
        books: 'Books',
        home: 'Home',
        sort_name: 'Name',
        sort_price_low: 'Price (Low to High)',
        sort_price_high: 'Price (High to Low)',
        shopping_cart: 'Shopping Cart',
        cart_empty: 'Cart is empty',
        checkout: 'Checkout',
        favorite_memo: 'Favorite Product Memo',
        memo_placeholder: 'Add memo...',
        add: 'Add',
        footer_text: '© 2025 ShopTodo - E2E Test Practice Application',
        add_to_cart: 'Add to Cart',
        product_image: 'Product Image',
        total: 'Total',
        memo_empty: 'No memos',
        login_required: 'Please login',
        product_added: 'Product added to cart',
        product_removed: 'Product removed from cart',
        memo_added: 'Memo added',
        memo_deleted: 'Memo deleted',
        login_success: 'Logged in successfully',
        logout_success: 'Logged out successfully',
        login_error: 'Invalid username or password',
        checkout_confirm: 'Proceed with checkout for',
        checkout_success: 'Checkout completed successfully',
        complete: 'Mark as complete',
        incomplete: 'Mark as incomplete',
        delete: 'Delete',
        product_names: {
            'スマートフォン': 'Smartphone',
            'ノートパソコン': 'Laptop',
            'Tシャツ': 'T-shirt',
            'ジーンズ': 'Jeans',
            'プログラミング入門書': 'Programming Basics',
            'JavaScript完全ガイド': 'JavaScript Complete Guide',
            'コーヒーメーカー': 'Coffee Maker',
            '掃除機': 'Vacuum Cleaner',
            'ワイヤレスイヤホン': 'Wireless Earphones',
            'スニーカー': 'Sneakers',
            'Web開発の教科書': 'Web Development Textbook',
            'キッチン用品セット': 'Kitchen Set'
        }
    }
};

// アプリケーションの状態管理
class AppState {
    constructor() {
        this.currentUser = null;
        this.products = [];
        this.cart = [];
        this.todos = [];
        this.filteredProducts = [];
        this.currentLanguage = 'ja';

        this.initializeData();
        this.loadFromStorage();
    }

    initializeData() {
        // サンプル商品データ
        this.products = [
            { id: 1, name: 'スマートフォン', price: 89800, category: 'electronics', image: 'phone.jpg' },
            { id: 2, name: 'ノートパソコン', price: 129800, category: 'electronics', image: 'laptop.jpg' },
            { id: 3, name: 'Tシャツ', price: 2980, category: 'clothing', image: 'tshirt.jpg' },
            { id: 4, name: 'ジーンズ', price: 7980, category: 'clothing', image: 'jeans.jpg' },
            { id: 5, name: 'プログラミング入門書', price: 3200, category: 'books', image: 'book.jpg' },
            { id: 6, name: 'JavaScript完全ガイド', price: 4800, category: 'books', image: 'jsbook.jpg' },
            { id: 7, name: 'コーヒーメーカー', price: 15800, category: 'home', image: 'coffee.jpg' },
            { id: 8, name: '掃除機', price: 25800, category: 'home', image: 'vacuum.jpg' },
            { id: 9, name: 'ワイヤレスイヤホン', price: 12800, category: 'electronics', image: 'earphones.jpg' },
            { id: 10, name: 'スニーカー', price: 8900, category: 'clothing', image: 'sneakers.jpg' },
            { id: 11, name: 'Web開発の教科書', price: 3800, category: 'books', image: 'webbook.jpg' },
            { id: 12, name: 'キッチン用品セット', price: 9800, category: 'home', image: 'kitchen.jpg' }
        ];

        this.filteredProducts = [...this.products];
    }

    loadFromStorage() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        }

        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
        }

        const savedTodos = localStorage.getItem('todos');
        if (savedTodos) {
            this.todos = JSON.parse(savedTodos);
        }

        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage) {
            this.currentLanguage = savedLanguage;
        }
    }

    saveToStorage() {
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        localStorage.setItem('cart', JSON.stringify(this.cart));
        localStorage.setItem('todos', JSON.stringify(this.todos));
        localStorage.setItem('language', this.currentLanguage);
    }

    setLanguage(language) {
        this.currentLanguage = language;
        this.saveToStorage();
    }

    login(username, password) {
        if (username === 'demo' && password === 'password') {
            this.currentUser = { username };
            this.saveToStorage();
            return true;
        }
        return false;
    }

    logout() {
        this.currentUser = null;
        this.cart = [];
        this.todos = [];
        localStorage.removeItem('currentUser');
        localStorage.removeItem('cart');
        localStorage.removeItem('todos');
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = this.cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({ ...product, quantity: 1 });
        }
        this.saveToStorage();
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveToStorage();
    }

    updateCartQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(0, quantity);
            if (item.quantity === 0) {
                this.removeFromCart(productId);
            } else {
                this.saveToStorage();
            }
        }
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    addTodo(text) {
        if (!text.trim()) return;

        const todo = {
            id: Date.now(),
            text: text.trim(),
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.todos.push(todo);
        this.saveToStorage();
    }

    toggleTodo(todoId) {
        const todo = this.todos.find(t => t.id === todoId);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveToStorage();
        }
    }

    deleteTodo(todoId) {
        this.todos = this.todos.filter(t => t.id !== todoId);
        this.saveToStorage();
    }

    filterProducts(searchTerm, category, sortBy) {
        let filtered = [...this.products];

        // 検索フィルタ
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // カテゴリフィルタ
        if (category) {
            filtered = filtered.filter(product => product.category === category);
        }

        // ソート
        switch (sortBy) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'name':
            default:
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }

        this.filteredProducts = filtered;
    }
}

// UI管理クラス
class UIManager {
    constructor(appState) {
        this.appState = appState;
        this.initializeEventListeners();
        this.updateUI();
    }

    initializeEventListeners() {
        // 言語切り替え
        document.getElementById('lang-en').addEventListener('click', () => {
            this.switchLanguage('en');
        });

        document.getElementById('lang-ja').addEventListener('click', () => {
            this.switchLanguage('ja');
        });

        // ログイン関連
        document.getElementById('login-btn').addEventListener('click', () => {
            this.showLoginModal();
        });

        document.getElementById('logout-btn').addEventListener('click', () => {
            this.logout();
        });

        document.getElementById('login-form').addEventListener('submit', (e) => {
            this.handleLogin(e);
        });

        // モーダル関連
        document.querySelector('.close').addEventListener('click', () => {
            this.hideLoginModal();
        });

        document.getElementById('login-modal').addEventListener('click', (e) => {
            if (e.target.id === 'login-modal') {
                this.hideLoginModal();
            }
        });

        // 検索・フィルタ関連
        document.getElementById('search-input').addEventListener('input', () => {
            this.updateProductFilters();
        });

        document.getElementById('category-filter').addEventListener('change', () => {
            this.updateProductFilters();
        });

        document.getElementById('sort-select').addEventListener('change', () => {
            this.updateProductFilters();
        });

        // チェックアウト
        document.getElementById('checkout-btn').addEventListener('click', () => {
            this.handleCheckout();
        });

        // Todo関連
        document.getElementById('add-todo-btn').addEventListener('click', () => {
            this.addTodo();
        });

        document.getElementById('todo-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });
    }

    updateUI() {
        this.updateLanguageUI();
        this.updateAuthUI();
        this.renderProducts();
        this.renderCart();
        this.renderTodos();
    }

    switchLanguage(language) {
        this.appState.setLanguage(language);
        this.updateLanguageUI();
        this.updateUI();
    }

    updateLanguageUI() {
        const currentLang = this.appState.currentLanguage;

        // 言語ボタンのアクティブ状態を更新
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`lang-${currentLang}`).classList.add('active');

        // data-i18n属性を持つ要素のテキストを更新
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (i18n[currentLang] && i18n[currentLang][key]) {
                element.textContent = i18n[currentLang][key];
            }
        });

        // placeholder属性の更新
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (i18n[currentLang] && i18n[currentLang][key]) {
                element.setAttribute('placeholder', i18n[currentLang][key]);
            }
        });

        // HTMLのlang属性を更新
        document.documentElement.lang = currentLang;

        // 動的に生成されるコンテンツも更新
        this.renderProducts();
        this.renderCart();
        this.renderTodos();
    }

    t(key) {
        return i18n[this.appState.currentLanguage][key] || key;
    }

    updateAuthUI() {
        const loginBtn = document.getElementById('login-btn');
        const userInfo = document.getElementById('user-info');
        const username = document.getElementById('username');

        if (this.appState.currentUser) {
            loginBtn.style.display = 'none';
            userInfo.style.display = 'flex';
            username.textContent = this.appState.currentUser.username;
        } else {
            loginBtn.style.display = 'block';
            userInfo.style.display = 'none';
        }
    }

    showLoginModal() {
        document.getElementById('login-modal').style.display = 'block';
    }

    hideLoginModal() {
        document.getElementById('login-modal').style.display = 'none';
        document.getElementById('login-form').reset();
    }

    handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('username-input').value;
        const password = document.getElementById('password-input').value;

        if (this.appState.login(username, password)) {
            this.hideLoginModal();
            this.updateUI();
            this.showMessage(this.t('login_success'), 'success');
        } else {
            this.showMessage(this.t('login_error'), 'error');
        }
    }

    logout() {
        this.appState.logout();
        this.updateUI();
        this.showMessage(this.t('logout_success'), 'success');
    }

    updateProductFilters() {
        const searchTerm = document.getElementById('search-input').value;
        const category = document.getElementById('category-filter').value;
        const sortBy = document.getElementById('sort-select').value;

        this.appState.filterProducts(searchTerm, category, sortBy);
        this.renderProducts();
    }

    renderProducts() {
        const grid = document.getElementById('products-grid');
        grid.innerHTML = '';

        this.appState.filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';

            const productName = this.getProductName(product.name);
            const categoryName = this.getCategoryName(product.category);
            const loginRequiredTitle = this.t('login_required');

            productCard.innerHTML = `
                <div class="product-image">${this.t('product_image')}</div>
                <div class="product-name">${productName}</div>
                <div class="product-price">¥${product.price.toLocaleString()}</div>
                <div class="product-category">${categoryName}</div>
                <button class="btn btn-primary" onclick="ui.addToCart(${product.id})"
                        ${!this.appState.currentUser ? `disabled title="${loginRequiredTitle}"` : ''}>
                    ${this.t('add_to_cart')}
                </button>
            `;
            grid.appendChild(productCard);
        });
    }

    getProductName(japaneseName) {
        const currentLang = this.appState.currentLanguage;
        if (currentLang === 'en' && i18n.ja.product_names[japaneseName]) {
            return i18n.ja.product_names[japaneseName];
        }
        return japaneseName;
    }

    getCategoryName(category) {
        return this.t(category);
    }

    addToCart(productId) {
        if (!this.appState.currentUser) {
            this.showMessage(this.t('login_required'), 'error');
            return;
        }

        this.appState.addToCart(productId);
        this.renderCart();
        this.showMessage(this.t('product_added'), 'success');
    }

    renderCart() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        const checkoutBtn = document.getElementById('checkout-btn');

        if (this.appState.cart.length === 0) {
            cartItems.innerHTML = `<p class="empty-cart">${this.t('cart_empty')}</p>`;
            cartTotal.textContent = `${this.t('total')}: ¥0`;
            checkoutBtn.disabled = true;
        } else {
            cartItems.innerHTML = '';
            this.appState.cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                const itemName = this.getProductName(item.name);
                cartItem.innerHTML = `
                    <div class="cart-item-info">
                        <div class="cart-item-name">${itemName}</div>
                        <div class="cart-item-price">¥${item.price.toLocaleString()} × ${item.quantity}</div>
                    </div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" onclick="ui.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="ui.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        <button class="todo-btn" onclick="ui.removeFromCart(${item.id})" title="${this.t('delete')}">🗑️</button>
                    </div>
                `;
                cartItems.appendChild(cartItem);
            });

            cartTotal.textContent = `${this.t('total')}: ¥${this.appState.getCartTotal().toLocaleString()}`;
            checkoutBtn.disabled = false;
        }
    }

    updateQuantity(productId, newQuantity) {
        this.appState.updateCartQuantity(productId, newQuantity);
        this.renderCart();
    }

    removeFromCart(productId) {
        this.appState.removeFromCart(productId);
        this.renderCart();
        this.showMessage(this.t('product_removed'), 'success');
    }

    handleCheckout() {
        if (this.appState.cart.length === 0) return;

        const total = this.appState.getCartTotal();
        if (confirm(`${this.t('checkout_confirm')} ¥${total.toLocaleString()}?`)) {
            this.appState.cart = [];
            this.appState.saveToStorage();
            this.renderCart();
            this.showMessage(this.t('checkout_success'), 'success');
        }
    }

    addTodo() {
        const input = document.getElementById('todo-input');
        const text = input.value.trim();

        if (!this.appState.currentUser) {
            this.showMessage(this.t('login_required'), 'error');
            return;
        }

        if (text) {
            this.appState.addTodo(text);
            input.value = '';
            this.renderTodos();
            this.showMessage(this.t('memo_added'), 'success');
        }
    }

    renderTodos() {
        const todoList = document.getElementById('todo-list');
        todoList.innerHTML = '';

        if (this.appState.todos.length === 0) {
            todoList.innerHTML = `<li class="todo-item"><span class="todo-text">${this.t('memo_empty')}</span></li>`;
            return;
        }

        this.appState.todos.forEach(todo => {
            const todoItem = document.createElement('li');
            todoItem.className = 'todo-item';
            const toggleTitle = todo.completed ? this.t('incomplete') : this.t('complete');
            todoItem.innerHTML = `
                <span class="todo-text ${todo.completed ? 'completed' : ''}">${todo.text}</span>
                <div class="todo-controls">
                    <button class="todo-btn" onclick="ui.toggleTodo(${todo.id})" title="${toggleTitle}">
                        ${todo.completed ? '↩️' : '✅'}
                    </button>
                    <button class="todo-btn" onclick="ui.deleteTodo(${todo.id})" title="${this.t('delete')}">🗑️</button>
                </div>
            `;
            todoList.appendChild(todoItem);
        });
    }

    toggleTodo(todoId) {
        this.appState.toggleTodo(todoId);
        this.renderTodos();
    }

    deleteTodo(todoId) {
        this.appState.deleteTodo(todoId);
        this.renderTodos();
        this.showMessage(this.t('memo_deleted'), 'success');
    }

    showMessage(message, type = 'info') {
        // 既存のメッセージがあれば削除
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
            color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};
            padding: 12px 20px;
            border-radius: 4px;
            border: 1px solid ${type === 'success' ? '#c3e6cb' : type === 'error' ? '#f5c6cb' : '#bee5eb'};
            z-index: 1001;
            font-size: 14px;
            max-width: 300px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        `;
        messageDiv.textContent = message;

        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
}

// アプリケーション初期化
let appState;
let ui;

document.addEventListener('DOMContentLoaded', () => {
    appState = new AppState();
    ui = new UIManager(appState);
});