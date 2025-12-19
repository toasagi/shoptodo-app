require('./setup');
const { request, app, testUser, testUser2, createAuthenticatedUser, authRequest, registerUser } = require('./helpers');

describe('Users API', () => {
  describe('GET /api/users/me', () => {
    it('should get user profile with valid token', async () => {
      const token = await createAuthenticatedUser();

      const res = await authRequest('get', '/api/users/me', token);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.username).toBe(testUser.username);
      expect(res.body.data.email).toBe(testUser.email);
      expect(res.body.data.profile).toBeDefined();
      expect(res.body.data.passwordHash).toBeUndefined();
    });

    it('should reject request without token', async () => {
      const res = await request(app).get('/api/users/me');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should reject request with invalid token', async () => {
      const res = await request(app)
        .get('/api/users/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/users/me', () => {
    it('should update user profile successfully', async () => {
      const token = await createAuthenticatedUser();

      const res = await authRequest('put', '/api/users/me', token)
        .send({
          displayName: 'Test User',
          phone: '123-456-7890',
          paymentMethod: 'credit_card'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.profile.displayName).toBe('Test User');
      expect(res.body.data.profile.phone).toBe('123-456-7890');
      expect(res.body.data.profile.paymentMethod).toBe('credit_card');
    });

    it('should update email successfully', async () => {
      const token = await createAuthenticatedUser();

      const res = await authRequest('put', '/api/users/me', token)
        .send({ email: 'newemail@example.com' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('newemail@example.com');
    });

    it('should reject duplicate email from another user', async () => {
      const token = await createAuthenticatedUser();
      await registerUser(testUser2);

      const res = await authRequest('put', '/api/users/me', token)
        .send({ email: testUser2.email });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('EMAIL_EXISTS');
    });

    it('should allow keeping same email', async () => {
      const token = await createAuthenticatedUser();

      const res = await authRequest('put', '/api/users/me', token)
        .send({ email: testUser.email });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('POST /api/users/migrate', () => {
    it('should migrate localStorage data successfully', async () => {
      const token = await createAuthenticatedUser();

      const migrateData = {
        cart: [{ productId: 'prod-1', name: 'Product', price: 100, quantity: 1 }],
        orders: [{ id: 'order-1', items: [], total: 100 }],
        todos: [{ id: 'todo-1', text: 'Test todo' }]
      };

      const res = await authRequest('post', '/api/users/migrate', token)
        .send(migrateData);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.migrated).toBe(true);
    });
  });
});
