// アプリケーションの状態管理
class AppState {
    constructor() {
        this.currentUser = null;
        this.products = [];
        this.cart = [];
        this.todos = [];
        this.filteredProducts = [];

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
    }

    saveToStorage() {
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        localStorage.setItem('cart', JSON.stringify(this.cart));
        localStorage.setItem('todos', JSON.stringify(this.todos));
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
        this.updateAuthUI();
        this.renderProducts();
        this.renderCart();
        this.renderTodos();
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
            this.showMessage('ログインしました', 'success');
        } else {
            this.showMessage('ユーザー名またはパスワードが正しくありません', 'error');
        }
    }

    logout() {
        this.appState.logout();
        this.updateUI();
        this.showMessage('ログアウトしました', 'success');
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
            productCard.innerHTML = `
                <div class="product-image">商品画像</div>
                <div class="product-name">${product.name}</div>
                <div class="product-price">¥${product.price.toLocaleString()}</div>
                <div class="product-category">${this.getCategoryName(product.category)}</div>
                <button class="btn btn-primary" onclick="ui.addToCart(${product.id})"
                        ${!this.appState.currentUser ? 'disabled title="ログインが必要です"' : ''}>
                    カートに追加
                </button>
            `;
            grid.appendChild(productCard);
        });
    }

    getCategoryName(category) {
        const categories = {
            electronics: '電子機器',
            clothing: '衣類',
            books: '書籍',
            home: 'ホーム'
        };
        return categories[category] || category;
    }

    addToCart(productId) {
        if (!this.appState.currentUser) {
            this.showMessage('ログインしてください', 'error');
            return;
        }

        this.appState.addToCart(productId);
        this.renderCart();
        this.showMessage('商品をカートに追加しました', 'success');
    }

    renderCart() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        const checkoutBtn = document.getElementById('checkout-btn');

        if (this.appState.cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">カートは空です</p>';
            cartTotal.textContent = '合計: ¥0';
            checkoutBtn.disabled = true;
        } else {
            cartItems.innerHTML = '';
            this.appState.cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">¥${item.price.toLocaleString()} × ${item.quantity}</div>
                    </div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" onclick="ui.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="ui.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        <button class="todo-btn" onclick="ui.removeFromCart(${item.id})" title="削除">🗑️</button>
                    </div>
                `;
                cartItems.appendChild(cartItem);
            });

            cartTotal.textContent = `合計: ¥${this.appState.getCartTotal().toLocaleString()}`;
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
        this.showMessage('商品をカートから削除しました', 'success');
    }

    handleCheckout() {
        if (this.appState.cart.length === 0) return;

        const total = this.appState.getCartTotal();
        if (confirm(`合計 ¥${total.toLocaleString()} でチェックアウトしますか？`)) {
            this.appState.cart = [];
            this.appState.saveToStorage();
            this.renderCart();
            this.showMessage('チェックアウトが完了しました', 'success');
        }
    }

    addTodo() {
        const input = document.getElementById('todo-input');
        const text = input.value.trim();

        if (!this.appState.currentUser) {
            this.showMessage('ログインしてください', 'error');
            return;
        }

        if (text) {
            this.appState.addTodo(text);
            input.value = '';
            this.renderTodos();
            this.showMessage('メモを追加しました', 'success');
        }
    }

    renderTodos() {
        const todoList = document.getElementById('todo-list');
        todoList.innerHTML = '';

        if (this.appState.todos.length === 0) {
            todoList.innerHTML = '<li class="todo-item"><span class="todo-text">メモはありません</span></li>';
            return;
        }

        this.appState.todos.forEach(todo => {
            const todoItem = document.createElement('li');
            todoItem.className = 'todo-item';
            todoItem.innerHTML = `
                <span class="todo-text ${todo.completed ? 'completed' : ''}">${todo.text}</span>
                <div class="todo-controls">
                    <button class="todo-btn" onclick="ui.toggleTodo(${todo.id})" title="${todo.completed ? '未完了にする' : '完了にする'}">
                        ${todo.completed ? '↩️' : '✅'}
                    </button>
                    <button class="todo-btn" onclick="ui.deleteTodo(${todo.id})" title="削除">🗑️</button>
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
        this.showMessage('メモを削除しました', 'success');
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