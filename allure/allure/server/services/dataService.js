const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');

class DataService {
  constructor() {
    this.usersFile = path.join(DATA_DIR, 'users.json');
    this.cartsFile = path.join(DATA_DIR, 'carts.json');
    this.ordersFile = path.join(DATA_DIR, 'orders.json');
    this.todosFile = path.join(DATA_DIR, 'todos.json');
  }

  // ============================================
  // Generic file operations
  // ============================================

  async readJsonFile(filePath) {
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return {};
      }
      throw error;
    }
  }

  async writeJsonFile(filePath, data) {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  }

  // ============================================
  // User operations
  // ============================================

  async getAllUsers() {
    return this.readJsonFile(this.usersFile);
  }

  async findUserById(userId) {
    const users = await this.getAllUsers();
    return users[userId] || null;
  }

  async findUserByUsername(username) {
    const users = await this.getAllUsers();
    return Object.values(users).find(user => user.username === username) || null;
  }

  async findUserByEmail(email) {
    const users = await this.getAllUsers();
    return Object.values(users).find(user => user.email === email) || null;
  }

  async createUser(user) {
    const users = await this.getAllUsers();
    users[user.id] = user;
    await this.writeJsonFile(this.usersFile, users);
    return user;
  }

  async updateUser(userId, updates) {
    const users = await this.getAllUsers();
    if (!users[userId]) {
      return null;
    }
    users[userId] = {
      ...users[userId],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    await this.writeJsonFile(this.usersFile, users);
    return users[userId];
  }

  // ============================================
  // Cart operations
  // ============================================

  async getCart(userId) {
    const carts = await this.readJsonFile(this.cartsFile);
    return carts[userId] || [];
  }

  async saveCart(userId, cartItems) {
    const carts = await this.readJsonFile(this.cartsFile);
    carts[userId] = cartItems;
    await this.writeJsonFile(this.cartsFile, carts);
    return cartItems;
  }

  async clearCart(userId) {
    return this.saveCart(userId, []);
  }

  // ============================================
  // Order operations
  // ============================================

  async getOrders(userId) {
    const orders = await this.readJsonFile(this.ordersFile);
    return orders[userId] || [];
  }

  async createOrder(userId, order) {
    const orders = await this.readJsonFile(this.ordersFile);
    if (!orders[userId]) {
      orders[userId] = [];
    }
    orders[userId].push(order);
    await this.writeJsonFile(this.ordersFile, orders);
    return order;
  }

  async getOrderById(userId, orderId) {
    const userOrders = await this.getOrders(userId);
    return userOrders.find(order => order.id === orderId) || null;
  }

  // ============================================
  // Todo operations
  // ============================================

  async getTodos(userId) {
    const todos = await this.readJsonFile(this.todosFile);
    return todos[userId] || [];
  }

  async saveTodos(userId, todoItems) {
    const todos = await this.readJsonFile(this.todosFile);
    todos[userId] = todoItems;
    await this.writeJsonFile(this.todosFile, todos);
    return todoItems;
  }

  async createTodo(userId, todo) {
    const userTodos = await this.getTodos(userId);
    userTodos.push(todo);
    await this.saveTodos(userId, userTodos);
    return todo;
  }

  async updateTodo(userId, todoId, updates) {
    const userTodos = await this.getTodos(userId);
    const index = userTodos.findIndex(todo => todo.id === todoId);
    if (index === -1) {
      return null;
    }
    userTodos[index] = { ...userTodos[index], ...updates };
    await this.saveTodos(userId, userTodos);
    return userTodos[index];
  }

  async deleteTodo(userId, todoId) {
    const userTodos = await this.getTodos(userId);
    const index = userTodos.findIndex(todo => todo.id === todoId);
    if (index === -1) {
      return false;
    }
    userTodos.splice(index, 1);
    await this.saveTodos(userId, userTodos);
    return true;
  }

  // ============================================
  // Data migration (from localStorage)
  // ============================================

  async migrateUserData(userId, data) {
    const { cart, orders, todos } = data;

    if (cart && Array.isArray(cart)) {
      await this.saveCart(userId, cart);
    }

    if (orders && Array.isArray(orders)) {
      const existingOrders = await this.getOrders(userId);
      const allOrders = await this.readJsonFile(this.ordersFile);
      allOrders[userId] = [...existingOrders, ...orders];
      await this.writeJsonFile(this.ordersFile, allOrders);
    }

    if (todos && Array.isArray(todos)) {
      await this.saveTodos(userId, todos);
    }

    return { migrated: true };
  }
}

module.exports = new DataService();
