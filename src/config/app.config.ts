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
    url: string;
    pool: {
      max: string;
    };
  };
  webhook: {
    url: string;
    secret: string;
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
    url: process.env.DATABASE_URL!,
    pool: {
      max: process.env.DATABASE_POOL_MAX!,
    },
  },
  webhook: {
    url: process.env.WEBHOOK_URL!,
    secret: process.env.WEBHOOK_SECRET!,
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
  DATABASE_URL: Joi.string().required(),
});

export const configModuleOpts: ConfigModuleOptions = {
  cache: true,
  isGlobal: true,
  load: [config],
  validationSchema: configSchema,
};
