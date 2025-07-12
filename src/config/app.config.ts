import { ConfigModuleOptions } from '@nestjs/config';
import Joi from 'joi';

export enum AppEnv {
  Local = 'local',
  Staging = 'staging',
  PreProduction = 'pre-production',
  Production = 'production',
}

export interface AppConfig {
  port: number;
  nodeEnv: string;
  appEnv: AppEnv;
  logging: {
    level: string;
    requestLoggerEnabled: boolean;
  };
  database: {
    host: string;
    user: string;
    password: string;
    database: string;
    port: number;
    pool: {
      max: string;
    };
  };
}

const config = (): AppConfig => ({
  port: +process.env.PORT!,
  nodeEnv: process.env.NODE_ENV!,
  appEnv: process.env.APP_ENV! as AppEnv,
  logging: {
    level: process.env.LOGGING_LEVEL!,
    requestLoggerEnabled: Boolean(+process.env.LOGGING_REQUEST_LOGGER_ENABLED!),
  },
  database: {
    host: process.env.DATABASE_HOST!,
    user: process.env.DATABASE_USER!,
    password: process.env.DATABASE_PASSWORD!,
    database: process.env.DATABASE_NAME!,
    port: +process.env.DATABASE_PORT!,
    pool: {
      max: process.env.DATABASE_POOL_MAX!,
    },
  },
});

const configSchema = Joi.object({
  PORT: Joi.string().default('3000'),
  NODE_ENV: Joi.string().default('development'),
  APP_ENV: Joi.string()
    .valid(...Object.values(AppEnv))
    .required(),
  LOGGING_LEVEL: Joi.string().default('info'),
  LOGGING_REQUEST_LOGGER_ENABLED: Joi.string().allow('0', '1').default('1'),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_PORT: Joi.number().required(),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_POOL_MAX: Joi.number().default(10),
});

export const configModuleOpts: ConfigModuleOptions = {
  cache: true,
  isGlobal: true,
  load: [config],
  validationSchema: configSchema,
};
