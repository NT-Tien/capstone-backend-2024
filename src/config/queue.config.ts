import * as dotenv from 'dotenv';
dotenv.config();

export const QUEUE_CONFIG = {
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
  },
};
