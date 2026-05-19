import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI || '', // Requires actual Mongo URI for production
  redisUrl: process.env.REDIS_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret', // Though we use RS256, keep this for basic needs
  internalServiceToken: process.env.INTERNAL_SERVICE_TOKEN || 'super_internal_token',
};
