const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

function requiredInProduction(name) {
  const value = process.env[name];
  if (process.env.NODE_ENV === 'production' && !value) {
    throw new Error(`${name} is required in production`);
  }
  return value;
}

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/civora',
  jwtSecret: process.env.JWT_SECRET || 'dev_only_change_me_not_for_production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  groqApiKey: process.env.GROQ_API_KEY || '',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  cookieSecure: process.env.COOKIE_SECURE === 'true',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@civora.app',
  adminPassword: process.env.ADMIN_PASSWORD || 'ChangeThisAdminPassword1',
};

if (env.nodeEnv === 'production') {
  requiredInProduction('MONGODB_URI');
  requiredInProduction('JWT_SECRET');
}

module.exports = env;
