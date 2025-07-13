import { ConfigService } from '@nestjs/config';
import { AppConfig } from './app.config';
import { CacheManagerOptions, CacheModuleAsyncOptions } from '@nestjs/cache-manager';

const getOpts = (c: ConfigService<AppConfig>): CacheManagerOptions => {
  const cache = c.get('cache', { infer: true })!;

  const opts: CacheManagerOptions = {
    ttl: cache.ttl,
  };

  return opts;
};

export const CacheConfigOpts: CacheModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (c: ConfigService<AppConfig>) => getOpts(c),
};
