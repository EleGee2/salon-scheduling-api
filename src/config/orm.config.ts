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
    type: 'mysql',
    synchronize: false,
    migrationsRun: false,
    autoLoadEntities: true,
    host: db.host,
    logging: true,
    entities: ['dist/**/*.entity.js'],
    username: db.user,
    password: db.password,
    database: db.database,
    port: db.port,
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

// DataSource configuration for TypeORM CLI
export default new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '3306'),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['src/**/*.entity.ts'],
  migrations: ['migrations/*.ts'],
  migrationsTableName: '__migrations',
  synchronize: false,
  logging: true,
});
