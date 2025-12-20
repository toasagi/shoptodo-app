module.exports = {
  jwt: {
    secret: process.env.JWT_SECRET || 'shoptodo-dev-secret-change-in-prod',
    expiresIn: '24h'
  },
  bcrypt: {
    saltRounds: 10
  },
  server: {
    port: process.env.PORT || 3001
  },
  cors: {
    origins: [
      'http://localhost:8000',
      'http://localhost:8001',
      'http://127.0.0.1:8000',
      'http://127.0.0.1:8001'
    ]
  }
};
