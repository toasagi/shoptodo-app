require('./setup');
const { request, app, testProduct, testProduct2, createAuthenticatedUser, authRequest } = require('./helpers');

describe('Cart API', () => {
  let token;

  beforeEach(async () => {
    token = await createAuthenticatedUser();
  });

  describe('GET /api/cart', () => {
    it('should return empty cart for new user', async () => {
      const res = await authRequest('get', '/api/cart', token);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual([]);
    });

    it('should return cart with items', async () => {
      await authRequest('post', '/api/cart', token).send(testProduct);

      const res = await authRequest('get', '/api/cart', token);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].productId).toBe(testProduct.productId);
    });

    it('should reject request without authentication', async () => {
      const res = await request(app).get('/api/cart');

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/cart', () => {
    it('should add product to cart', async () => {
      const res = await authRequest('post', '/api/cart', token)
        .send(testProduct);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].productId).toBe(testProduct.productId);
      expect(res.body.data[0].name).toBe(testProduct.name);
      expect(res.body.data[0].price).toBe(testProduct.price);
    });

    it('should merge quantity when adding duplicate product', async () => {
      await authRequest('post', '/api/cart', token).send(testProduct);
      const res = await authRequest('post', '/api/cart', token)
        .send({ ...testProduct, quantity: 2 });

      expect(res.status).toBe(201);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].quantity).toBe(3);
    });

    it('should add multiple different products', async () => {
      await authRequest('post', '/api/cart', token).send(testProduct);
      const res = await authRequest('post', '/api/cart', token)
        .send(testProduct2);

      expect(res.status).toBe(201);
      expect(res.body.data).toHaveLength(2);
    });

    it('should reject product without required fields', async () => {
      const res = await authRequest('post', '/api/cart', token)
        .send({ name: 'Product' });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('PUT /api/cart/:productId', () => {
    beforeEach(async () => {
      await authRequest('post', '/api/cart', token).send(testProduct);
    });

    it('should update product quantity', async () => {
      const res = await authRequest('put', `/api/cart/${testProduct.productId}`, token)
        .send({ quantity: 5 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data[0].quantity).toBe(5);
    });

    it('should remove product when quantity is 0', async () => {
      const res = await authRequest('put', `/api/cart/${testProduct.productId}`, token)
        .send({ quantity: 0 });

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(0);
    });

    it('should reject update for non-existent product', async () => {
      const res = await authRequest('put', '/api/cart/non-existent', token)
        .send({ quantity: 5 });

      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('CART_ITEM_NOT_FOUND');
    });

    it('should reject invalid quantity', async () => {
      const res = await authRequest('put', `/api/cart/${testProduct.productId}`, token)
        .send({ quantity: -1 });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('DELETE /api/cart/:productId', () => {
    beforeEach(async () => {
      await authRequest('post', '/api/cart', token).send(testProduct);
    });

    it('should remove product from cart', async () => {
      const res = await authRequest('delete', `/api/cart/${testProduct.productId}`, token);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(0);
    });

    it('should reject deletion of non-existent product', async () => {
      const res = await authRequest('delete', '/api/cart/non-existent', token);

      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('CART_ITEM_NOT_FOUND');
    });
  });

  describe('DELETE /api/cart', () => {
    beforeEach(async () => {
      await authRequest('post', '/api/cart', token).send(testProduct);
      await authRequest('post', '/api/cart', token).send(testProduct2);
    });

    it('should clear entire cart', async () => {
      const res = await authRequest('delete', '/api/cart', token);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual([]);
    });
  });
});
