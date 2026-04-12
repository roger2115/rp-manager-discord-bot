import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  console.log('✅ Connected to Redis');
});

export const connectRedis = async () => {
  try {
    if (process.env.REDIS_URL) {
      await redisClient.connect();
    } else {
      console.log('⚠️  Redis disabled - using in-memory cache');
    }
  } catch (error) {
    console.error('❌ Failed to connect to Redis:', error);
    console.log('⚠️  Continuing without Redis cache');
  }
};

export default redisClient;
