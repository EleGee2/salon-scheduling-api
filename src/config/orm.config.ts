import { ConfigService } from '@nestjs/config';
import { AppConfig } from './app.config';
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

function cleanDbConnValue(value: string): number {
  const defaultConnValue = 10;
  const maxAllowedConnValue = 1000;
  let dbConValue = defaultConnValue;
  const customValue = Number(value);
  if (!isNaN(customValue) && customValue > 0 && customValue <= maxAllowedConnValue) {
    dbConValue = Math.floor(customValue);
  }
  return dbConValue;
}

const getOpts = (c: ConfigService<AppConfig>): TypeOrmModuleOptions => {
  const db = c.get('database', { infer: true })!;

  const opts: TypeOrmModuleOptions = {
    type: 'postgres',
    synchronize: false,
    migrationsRun: false,
    autoLoadEntities: true,
    url: db.url,
    logging: true,
    entities: ['dist/models/**/*.entity.js'],
    migrations: ['dist/migrations/*.ts'],
    migrationsTableName: '__migrations',
    poolSize: cleanDbConnValue(db.pool.max),
  };
  return opts;
};

export const TypeOrmConfigOpts: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: (c: ConfigService<AppConfig>) => getOpts(c),
};

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: ['src/models/**/*.entity.ts'],
  migrations: ['migrations/*.ts'],
  migrationsTableName: '__migrations',
  synchronize: false,
  logging: true,
});
