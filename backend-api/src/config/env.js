const path = require('node:path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env'), quiet: true });
function getEnv() {
  const { MONGODB_URI, JWT_SECRET } = process.env;
  if (!MONGODB_URI || !JWT_SECRET || JWT_SECRET.length < 32) {
    throw new Error('Cần MONGODB_URI và JWT_SECRET ít nhất 32 ký tự trong backend-api/.env');
  }
  return {
    mongoUri: MONGODB_URI,
    jwtSecret: JWT_SECRET,
    port: Number(process.env.PORT || 3000),
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:4200',
  };
}
module.exports = { getEnv };
