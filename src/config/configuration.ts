import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import ormConfig from '../../ormconfig';
import * as redisStore from 'cache-manager-redis-store';
import { CacheModuleOptions } from '@nestjs/common';

const getAMQPOptions = () => {
  const exchanges = {
    events: {
      name: 'events',
      type: 'topic',
    },
  };
  const username = process.env.RABBITMQ_DEFAULT_USER;
  const password = process.env.RABBITMQ_DEFAULT_PASS;
  const hostname = process.env.RABBITMQ_HOST;
  const port = parseInt(process.env.RABBITMQ_PORT, 10);
  return {
    name: process.env.RABBITMQ_NAME,
    hostname,
    port,
    username,
    password,
    exchanges,
    config: {
      exchanges: [exchanges.events],
      uri: `amqp://${username}:${password}@${hostname}:${port}`,
      connectionInitOptions: { wait: false },
    },
  };
};

const databaseDefaultConfig = (): TypeOrmModuleOptions =>
  ({ ...ormConfig } as TypeOrmModuleOptions);

export const getCacheConfig = async (): Promise<CacheModuleOptions> => ({
  store: redisStore,
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  isGlobal: true,
  ttl: 0,
});

export default () => ({
  applicationName: `${process.env.APPLICATION_NAME} CHAT SERVICE`,
  url: `${process.env.CHAT_SERVICE_HOST}:${process.env.CHAT_SERVICE_PORT}`,
  port: process.env.CHAT_SERVICE_PORT,
  allowedOrigins: [process.env.DASHBOARD_URL],
  jwtSecretKey: process.env.JWT_SECRET_KEY,
  authUrl: process.env.AUTH_SERVICE_URL,
  getCacheConfig: getCacheConfig,
  databaseDefaultConfig: databaseDefaultConfig(),
  amqp: getAMQPOptions(),
});
