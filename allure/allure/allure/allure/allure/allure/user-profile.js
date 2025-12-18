// User Profile Page Manager
class UserProfileManager {
    constructor(appState) {
        this.appState = appState;
        this.checkAuth();
        this.initializeEventListeners();
        this.updateUI();
    }

    checkAuth() {
        // Redirect to index if not logged in
        if (!this.appState.currentUser) {
            window.location.href = 'index.html';
            return;
        }
    }

    initializeEventListeners() {
        // Language switcher
        const langEn = document.getElementById('lang-en');
        const langJa = document.getElementById('lang-ja');
        if (langEn) {
            langEn.addEventListener('click', () => {
                this.switchLanguage('en');
            });
        }
        if (langJa) {
            langJa.addEventListener('click', () => {
                this.switchLanguage('ja');
            });
        }

        // Logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.appState.logout();
                window.location.href = 'index.html';
            });
        }

        // Profile form
        const profileForm = document.getElementById('profile-form');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                this.handleProfileSubmit(e);
            });
        }

        // Todo
        const addTodoBtn = document.getElementById('add-todo-btn');
        const todoInput = document.getElementById('todo-input');
        if (addTodoBtn) {
            addTodoBtn.addEventListener('click', () => {
                this.addTodo();
            });
        }
        if (todoInput) {
            todoInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.addTodo();
                }
            });
        }
    }

    updateUI() {
        this.updateLanguageUI();
        this.updateAuthUI();
        this.loadProfileData();
        this.renderTodos();
        this.renderOrderHistory();
    }

    switchLanguage(language) {
        this.appState.setLanguage(language);
        this.updateLanguageUI();
        this.renderTodos();
        this.renderOrderHistory();
    }

    updateLanguageUI() {
        const currentLang = this.appState.currentLanguage;

        // Update language buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`lang-${currentLang}`).classList.add('active');

        // Update data-i18n elements
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (i18n[currentLang] && i18n[currentLang][key]) {
                element.textContent = i18n[currentLang][key];
            }
        });

        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (i18n[currentLang] && i18n[currentLang][key]) {
                element.setAttribute('placeholder', i18n[currentLang][key]);
            }
        });

        // Update page title
        document.title = this.t('user_profile') + ' - ShopTodo';

        // Update html lang attribute
        document.documentElement.lang = currentLang;

        // Update select options
        this.updateSelectOptions();
    }

    updateSelectOptions() {
        const paymentSelect = document.getElementById('payment-method');
        const options = paymentSelect.querySelectorAll('option[data-i18n]');
        options.forEach(option => {
            const key = option.getAttribute('data-i18n');
            if (i18n[this.appState.currentLanguage][key]) {
                option.textContent = i18n[this.appState.currentLanguage][key];
            }
        });
    }

    t(key) {
        return i18n[this.appState.currentLanguage][key] || key;
    }

    updateAuthUI() {
        const userInfo = document.getElementById('user-info');
        const username = document.getElementById('username');

        if (this.appState.currentUser) {
            userInfo.style.display = 'flex';
            username.textContent = this.appState.currentUser.username;
        }
    }

    loadProfileData() {
        const profile = this.appState.getProfile();
        if (profile) {
            document.getElementById('display-name').value = profile.displayName || '';
            document.getElementById('phone').value = profile.phone || '';
            document.getElementById('payment-method').value = profile.paymentMethod || '';
        }
    }

    handleProfileSubmit(e) {
        e.preventDefault();

        const profileData = {
            displayName: document.getElementById('display-name').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            paymentMethod: document.getElementById('payment-method').value
        };

        if (this.appState.saveProfile(profileData)) {
            this.showMessage(this.t('profile_saved'), 'success');
        }
    }

    addTodo() {
        const input = document.getElementById('todo-input');
        const text = input.value.trim();

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
                    <button class="todo-btn" onclick="profileManager.toggleTodo(${todo.id})" title="${toggleTitle}">
                        ${todo.completed ? '↩️' : '✅'}
                    </button>
                    <button class="todo-btn" onclick="profileManager.deleteTodo(${todo.id})" title="${this.t('delete')}">🗑️</button>
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

    getProductName(japaneseName) {
        const currentLang = this.appState.currentLanguage;
        if (currentLang === 'en' && i18n.ja.product_names[japaneseName]) {
            return i18n.ja.product_names[japaneseName];
        }
        return japaneseName;
    }

    renderOrderHistory() {
        const historyList = document.getElementById('order-history-list');
        historyList.innerHTML = '';

        if (this.appState.orders.length === 0) {
            historyList.innerHTML = `<div class="empty-message">${this.t('no_orders')}</div>`;
            return;
        }

        const sortedOrders = [...this.appState.orders].sort((a, b) => b.id - a.id);

        sortedOrders.forEach(order => {
            const orderDiv = document.createElement('div');
            orderDiv.className = 'order-history-item';

            const orderDate = new Date(order.date).toLocaleDateString(
                this.appState.currentLanguage === 'ja' ? 'ja-JP' : 'en-US'
            );

            let itemsHTML = '';
            order.items.forEach(item => {
                const itemName = this.getProductName(item.name);
                itemsHTML += `
                    <div class="order-item-line">
                        <span>${itemName} × ${item.quantity}</span>
                        <span>¥${(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                `;
            });

            orderDiv.innerHTML = `
                <div class="order-header">
                    <div class="order-id">${this.t('order_number')}: ${order.id}</div>
                    <div class="order-date-text">${this.t('order_date')}: ${orderDate}</div>
                </div>
                <div class="order-items-summary">
                    ${itemsHTML}
                </div>
                <div class="order-total-line">
                    <span>${this.t('total')}:</span>
                    <span>¥${order.total.toLocaleString()}</span>
                </div>
            `;

            historyList.appendChild(orderDiv);
        });
    }

    showMessage(message, type = 'info') {
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;

        // アクセシビリティ: aria-live リージョン (WCAG 4.1.3)
        if (type === 'error') {
            messageDiv.setAttribute('role', 'alert');
            messageDiv.setAttribute('aria-live', 'assertive');
        } else {
            messageDiv.setAttribute('role', 'status');
            messageDiv.setAttribute('aria-live', 'polite');
        }

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

// Initialize
let profileManager;

document.addEventListener('DOMContentLoaded', () => {
    // appState is loaded from app.js
    if (typeof appState !== 'undefined') {
        profileManager = new UserProfileManager(appState);
    } else {
        // If appState is not ready yet, wait for it
        const checkAppState = setInterval(() => {
            if (typeof appState !== 'undefined') {
                clearInterval(checkAppState);
                profileManager = new UserProfileManager(appState);
            }
        }, 100);

        // Timeout after 5 seconds
        setTimeout(() => {
            clearInterval(checkAppState);
            if (typeof appState === 'undefined') {
                window.location.href = 'index.html';
            }
        }, 5000);
    }
});
