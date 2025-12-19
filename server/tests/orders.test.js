require('./setup');
const { request, app, testProduct, testProduct2, createAuthenticatedUser, authRequest } = require('./helpers');

describe('Orders API', () => {
  let token;

  beforeEach(async () => {
    token = await createAuthenticatedUser();
  });

  describe('GET /api/orders', () => {
    it('should return empty orders for new user', async () => {
      const res = await authRequest('get', '/api/orders', token);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual([]);
    });

    it('should return orders after creating one', async () => {
      // Add items to cart first
      await authRequest('post', '/api/cart', token).send(testProduct);
      // Create order
      await authRequest('post', '/api/orders', token).send({});

      const res = await authRequest('get', '/api/orders', token);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
    });

    it('should reject request without authentication', async () => {
      const res = await request(app).get('/api/orders');

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/orders/:orderId', () => {
    let orderId;

    beforeEach(async () => {
      await authRequest('post', '/api/cart', token).send(testProduct);
      const orderRes = await authRequest('post', '/api/orders', token).send({});
      orderId = orderRes.body.data.id;
    });

    it('should return specific order by ID', async () => {
      const res = await authRequest('get', `/api/orders/${orderId}`, token);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(orderId);
    });

    it('should return 404 for non-existent order', async () => {
      const res = await authRequest('get', '/api/orders/non-existent-id', token);

      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('POST /api/orders', () => {
    it('should create order from cart', async () => {
      await authRequest('post', '/api/cart', token).send(testProduct);
      await authRequest('post', '/api/cart', token).send(testProduct2);

      const res = await authRequest('post', '/api/orders', token)
        .send({
          shippingAddress: {
            name: 'Test User',
            address: '123 Test St'
          },
          paymentMethod: 'credit_card'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.items).toHaveLength(2);
      expect(res.body.data.total).toBe(testProduct.price * testProduct.quantity + testProduct2.price * testProduct2.quantity);
      expect(res.body.data.status).toBe('pending');
    });

    it('should clear cart after order creation', async () => {
      await authRequest('post', '/api/cart', token).send(testProduct);
      await authRequest('post', '/api/orders', token).send({});

      const cartRes = await authRequest('get', '/api/cart', token);

      expect(cartRes.body.data).toHaveLength(0);
    });

    it('should create order with explicit items', async () => {
      const res = await authRequest('post', '/api/orders', token)
        .send({
          items: [testProduct],
          shippingAddress: { name: 'Test' },
          paymentMethod: 'bank_transfer'
        });

      expect(res.status).toBe(201);
      expect(res.body.data.items).toHaveLength(1);
      expect(res.body.data.paymentMethod).toBe('bank_transfer');
    });

    it('should reject order with empty cart and no items', async () => {
      const res = await authRequest('post', '/api/orders', token).send({});

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });
});
