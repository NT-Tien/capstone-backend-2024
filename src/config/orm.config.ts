import * as dotenv from 'dotenv';
dotenv.config();

export const TYPE_ORM_CONFIG = {
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT as any,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: process.env.ENV === 'main' ? true : false,
  entities: ['dist/**/*.entity.js'],
  subscribers: ['dist/**/*.subscriber.js'],
  ssl: process.env.ENV === 'production' ? { ca: process.env.DB_SSL_CA } : false,
};
