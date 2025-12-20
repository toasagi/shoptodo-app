/**
 * API Client for ShopTodo Backend
 * Handles all communication with the Express server
 */
class ApiClient {
  constructor(baseUrl = 'http://localhost:3001/api') {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('authToken');
  }

  /**
   * Set authentication token
   * @param {string} token - JWT token
   */
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  /**
   * Get stored token
   * @returns {string|null}
   */
  getToken() {
    return this.token;
  }

  /**
   * Clear authentication
   */
  clearAuth() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  /**
   * Make an API request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Fetch options
   * @returns {Promise<Object>}
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      const data = await response.json();

      if (!response.ok) {
        const error = new Error(data.error?.message || 'API request failed');
        error.code = data.error?.code || 'UNKNOWN_ERROR';
        error.status = response.status;
        error.details = data.error?.details;
        throw error;
      }

      return data;
    } catch (error) {
      if (error.code) {
        throw error;
      }
      // Network error
      const networkError = new Error('Network error. Please check your connection.');
      networkError.code = 'NETWORK_ERROR';
      throw networkError;
    }
  }

  // ============================================
  // Authentication
  // ============================================

  /**
   * Register a new user
   * @param {string} username
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Object>}
   */
  async register(username, email, password) {
    const result = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password })
    });
    return result.data;
  }

  /**
   * Login user
   * @param {string} username
   * @param {string} password
   * @returns {Promise<Object>}
   */
  async login(username, password) {
    const result = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });

    if (result.data?.token) {
      this.setToken(result.data.token);
    }

    return result.data;
  }

  /**
   * Logout user
   */
  logout() {
    this.clearAuth();
  }

  // ============================================
  // User Profile
  // ============================================

  /**
   * Get current user profile
   * @returns {Promise<Object>}
   */
  async getProfile() {
    const result = await this.request('/users/me');
    return result.data;
  }

  /**
   * Update user profile
   * @param {Object} updates
   * @returns {Promise<Object>}
   */
  async updateProfile(updates) {
    const result = await this.request('/users/me', {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
    return result.data;
  }

  /**
   * Migrate localStorage data to server
   * @param {Object} data - { cart, orders, todos }
   * @returns {Promise<Object>}
   */
  async migrateData(data) {
    const result = await this.request('/users/migrate', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return result.data;
  }

  // ============================================
  // Cart
  // ============================================

  /**
   * Get user's cart
   * @returns {Promise<Array>}
   */
  async getCart() {
    const result = await this.request('/cart');
    return result.data;
  }

  /**
   * Add item to cart
   * @param {Object} item - { productId, name, price, quantity, image }
   * @returns {Promise<Array>}
   */
  async addToCart(item) {
    const result = await this.request('/cart', {
      method: 'POST',
      body: JSON.stringify(item)
    });
    return result.data;
  }

  /**
   * Update cart item quantity
   * @param {string} productId
   * @param {number} quantity
   * @returns {Promise<Array>}
   */
  async updateCartItem(productId, quantity) {
    const result = await this.request(`/cart/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity })
    });
    return result.data;
  }

  /**
   * Remove item from cart
   * @param {string} productId
   * @returns {Promise<Array>}
   */
  async removeFromCart(productId) {
    const result = await this.request(`/cart/${productId}`, {
      method: 'DELETE'
    });
    return result.data;
  }

  /**
   * Clear entire cart
   * @returns {Promise<Array>}
   */
  async clearCart() {
    const result = await this.request('/cart', {
      method: 'DELETE'
    });
    return result.data;
  }

  // ============================================
  // Orders
  // ============================================

  /**
   * Get all orders
   * @returns {Promise<Array>}
   */
  async getOrders() {
    const result = await this.request('/orders');
    return result.data;
  }

  /**
   * Get order by ID
   * @param {string} orderId
   * @returns {Promise<Object>}
   */
  async getOrder(orderId) {
    const result = await this.request(`/orders/${orderId}`);
    return result.data;
  }

  /**
   * Create order from current cart
   * @param {Object} options - { shippingAddress, paymentMethod }
   * @returns {Promise<Object>}
   */
  async createOrder(options = {}) {
    const result = await this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(options)
    });
    return result.data;
  }

  // ============================================
  // Todos
  // ============================================

  /**
   * Get all todos
   * @returns {Promise<Array>}
   */
  async getTodos() {
    const result = await this.request('/todos');
    return result.data;
  }

  /**
   * Add a new todo
   * @param {Object} todo - { text, productId, productName, productPrice, productImage, quantity }
   * @returns {Promise<Object>}
   */
  async addTodo(todo) {
    const result = await this.request('/todos', {
      method: 'POST',
      body: JSON.stringify(todo)
    });
    return result.data;
  }

  /**
   * Update todo
   * @param {string} todoId
   * @param {Object} updates - { text, completed, quantity }
   * @returns {Promise<Object>}
   */
  async updateTodo(todoId, updates) {
    const result = await this.request(`/todos/${todoId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
    return result.data;
  }

  /**
   * Delete todo
   * @param {string} todoId
   * @returns {Promise<Object>}
   */
  async deleteTodo(todoId) {
    const result = await this.request(`/todos/${todoId}`, {
      method: 'DELETE'
    });
    return result.data;
  }

  /**
   * Sync all todos (bulk replace)
   * @param {Array} todos
   * @returns {Promise<Array>}
   */
  async syncTodos(todos) {
    const result = await this.request('/todos/bulk', {
      method: 'POST',
      body: JSON.stringify({ todos })
    });
    return result.data;
  }

  // ============================================
  // Health Check
  // ============================================

  /**
   * Check if server is available
   * @returns {Promise<boolean>}
   */
  async isServerAvailable() {
    try {
      await this.request('/health');
      return true;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
const apiClient = new ApiClient();
