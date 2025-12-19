require('./setup');
const { request, app, testUser, testUser2, registerUser, loginUser } = require('./helpers');

describe('Authentication API', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await registerUser();

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user).toBeDefined();
      expect(res.body.data.user.username).toBe(testUser.username);
      expect(res.body.data.user.email).toBe(testUser.email);
      expect(res.body.data.user.passwordHash).toBeUndefined();
    });

    it('should reject registration with short username (< 3 chars)', async () => {
      const res = await registerUser({
        username: 'ab',
        email: 'test@example.com',
        password: 'password123'
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject registration with invalid email', async () => {
      const res = await registerUser({
        username: 'testuser',
        email: 'invalid-email',
        password: 'password123'
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject registration with short password (< 6 chars)', async () => {
      const res = await registerUser({
        username: 'testuser',
        email: 'test@example.com',
        password: '12345'
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject duplicate username', async () => {
      await registerUser(testUser);
      const res = await registerUser({
        ...testUser2,
        username: testUser.username
      });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('USERNAME_EXISTS');
    });

    it('should reject duplicate email', async () => {
      await registerUser(testUser);
      const res = await registerUser({
        ...testUser2,
        email: testUser.email
      });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('EMAIL_EXISTS');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await registerUser(testUser);
    });

    it('should login successfully with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: testUser.username,
          password: testUser.password
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user).toBeDefined();
      expect(res.body.data.user.username).toBe(testUser.username);
    });

    it('should reject login with invalid username', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'wronguser',
          password: testUser.password
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
    });

    it('should reject login with invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: testUser.username,
          password: 'wrongpassword'
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
    });
  });
});
