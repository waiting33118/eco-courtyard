import app from './app';
import 'reflect-metadata';
import './configs/database';
import { logger } from './plugins/logger';
import { loggerTopic } from './utils/loggerTopics';

const PORT = process.env.PORT || 3080;

app.listen(+PORT, () =>
  logger.info(
    `[${loggerTopic.SERVER}] API server is listening on port: ${PORT}`
  )
);
