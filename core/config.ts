import dotenv from 'dotenv';
dotenv.config();

const isProduction = process.env.NODE_ENV === 'production' || process.env.APP_MODE === 'production';

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI || '',
  redisUrl: process.env.REDIS_URL || '',
  jwtSecret: process.env.JWT_SECRET || (isProduction ? '' : 'dev-secret-only'),
  internalServiceToken: process.env.INTERNAL_SERVICE_TOKEN || (isProduction ? '' : 'dev-internal-token-only'),
};

if (isProduction && !process.env.INTERNAL_SERVICE_TOKEN) {
  console.warn('[SECURITY WARNING] INTERNAL_SERVICE_TOKEN must be configured in production.');
}
