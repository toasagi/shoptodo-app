require('./setup');
const { request, app, testTodo, createAuthenticatedUser, authRequest } = require('./helpers');

describe('Todos API', () => {
  let token;

  beforeEach(async () => {
    token = await createAuthenticatedUser();
  });

  describe('GET /api/todos', () => {
    it('should return empty todos for new user', async () => {
      const res = await authRequest('get', '/api/todos', token);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual([]);
    });

    it('should return todos after creating one', async () => {
      await authRequest('post', '/api/todos', token).send(testTodo);

      const res = await authRequest('get', '/api/todos', token);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
    });

    it('should reject request without authentication', async () => {
      const res = await request(app).get('/api/todos');

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/todos', () => {
    it('should create a new todo', async () => {
      const res = await authRequest('post', '/api/todos', token)
        .send(testTodo);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.text).toBe(testTodo.text);
      expect(res.body.data.completed).toBe(false);
      expect(res.body.data.productId).toBe(testTodo.productId);
    });

    it('should create todo with minimal data', async () => {
      const res = await authRequest('post', '/api/todos', token)
        .send({ text: 'Simple todo' });

      expect(res.status).toBe(201);
      expect(res.body.data.text).toBe('Simple todo');
      expect(res.body.data.productId).toBeNull();
    });

    it('should reject todo without text', async () => {
      const res = await authRequest('post', '/api/todos', token)
        .send({ productId: 'prod-1' });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('PUT /api/todos/:todoId', () => {
    let todoId;

    beforeEach(async () => {
      const createRes = await authRequest('post', '/api/todos', token).send(testTodo);
      todoId = createRes.body.data.id;
    });

    it('should update todo text', async () => {
      const res = await authRequest('put', `/api/todos/${todoId}`, token)
        .send({ text: 'Updated todo' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.text).toBe('Updated todo');
    });

    it('should toggle todo completion', async () => {
      const res = await authRequest('put', `/api/todos/${todoId}`, token)
        .send({ completed: true });

      expect(res.status).toBe(200);
      expect(res.body.data.completed).toBe(true);
    });

    it('should update todo quantity', async () => {
      const res = await authRequest('put', `/api/todos/${todoId}`, token)
        .send({ quantity: 5 });

      expect(res.status).toBe(200);
      expect(res.body.data.quantity).toBe(5);
    });

    it('should return 404 for non-existent todo', async () => {
      const res = await authRequest('put', '/api/todos/non-existent-id', token)
        .send({ text: 'Updated' });

      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('DELETE /api/todos/:todoId', () => {
    let todoId;

    beforeEach(async () => {
      const createRes = await authRequest('post', '/api/todos', token).send(testTodo);
      todoId = createRes.body.data.id;
    });

    it('should delete todo', async () => {
      const res = await authRequest('delete', `/api/todos/${todoId}`, token);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify deletion
      const listRes = await authRequest('get', '/api/todos', token);
      expect(listRes.body.data).toHaveLength(0);
    });

    it('should return 404 for non-existent todo', async () => {
      const res = await authRequest('delete', '/api/todos/non-existent-id', token);

      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('POST /api/todos/bulk', () => {
    it('should sync todos (replace all)', async () => {
      // Create initial todos
      await authRequest('post', '/api/todos', token).send({ text: 'Initial todo' });

      const newTodos = [
        { text: 'Todo 1' },
        { text: 'Todo 2' },
        { text: 'Todo 3' }
      ];

      const res = await authRequest('post', '/api/todos/bulk', token)
        .send({ todos: newTodos });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(3);

      // Verify replacement
      const listRes = await authRequest('get', '/api/todos', token);
      expect(listRes.body.data).toHaveLength(3);
    });

    it('should reject non-array todos', async () => {
      const res = await authRequest('post', '/api/todos/bulk', token)
        .send({ todos: 'not-an-array' });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });
});
