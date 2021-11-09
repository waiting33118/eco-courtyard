import path from 'path';
import { createConnection } from 'typeorm';
import { logger } from '../plugins/logger';
import { loggerTopic } from '../utils/loggerTopics';

const entitiesPath =
  process.env.NODE_ENV === 'development'
    ? path.resolve(__dirname, '../', 'entities/*.ts')
    : path.resolve(__dirname, '../../', 'dist/', 'entities/*.js');
const host = process.env.DATABASE_HOST || '127.0.0.1';
const port = process.env.DATABASE_PORT ?? 3306;

createConnection({
  type: 'mysql',
  entities: [entitiesPath],
  synchronize: process.env.NODE_ENV === 'development',
  host,
  port: +port,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
})
  .then(() => logger.info(`[${loggerTopic.DATABASE}] Database connected`))
  .catch((error) => logger.error(`[${loggerTopic.DATABASE}] ${error}`));
