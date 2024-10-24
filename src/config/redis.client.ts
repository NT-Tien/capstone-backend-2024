import * as dotenv from 'dotenv';
import { Redis } from 'ioredis';
dotenv.config();

export const redisClientLocal = new Redis({
  port: parseInt(process.env.REDIS_PORT),
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
  reconnectOnError: () => true,
});

export const CACHE_REDIS_CONFIG = {
  socket: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
  },
  password: process.env.REDIS_PASSWORD,
};
