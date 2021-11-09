import winston from 'winston';

const { combine, printf, timestamp } = winston.format;
const customFormat = printf(
  ({ level, message, timestamp }) => `${timestamp} [${level}] ${message}`
);

export const logger = winston.createLogger({
  format: combine(timestamp(), customFormat),
  transports: [new winston.transports.Console()]
});
