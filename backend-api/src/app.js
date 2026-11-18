const express = require('express');
const cors = require('cors');
const { ApiError, errorHandler } = require('./shared/errors');
function createApp(origin = 'http://localhost:4200') {
  const app = express();
  app.disable('x-powered-by');
  app.use(cors({ origin, allowedHeaders: ['Content-Type', 'Authorization', 'Idempotency-Key'] }));
  app.use(express.json({ limit: '100kb' }));
  app.use((req, res, next) => {
    if (
      ['POST', 'PUT', 'PATCH'].includes(req.method) &&
      (!req.body || typeof req.body !== 'object' || Array.isArray(req.body))
    ) {
      throw new ApiError(400, 'Nội dung yêu cầu phải là một JSON object.');
    }
    next();
  });
  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
  for (const [path, module] of [
    ['auth', 'auth'],
    ['products', 'product'],
    ['cart', 'cart'],
    ['orders', 'order'],
    ['users', 'user'],
    ['notifications', 'notification'],
    ['admin', 'admin'],
  ]) {
    app.use(`/api/${path}`, require(`./modules/${module}/${module}.routes`));
  }
  app.use((req, res) => res.status(404).json({ message: 'API không tồn tại.' }));
  app.use(errorHandler);
  return app;
}
module.exports = { createApp };
