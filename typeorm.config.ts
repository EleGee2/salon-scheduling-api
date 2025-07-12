import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: ['src/**/entities/*.entity.ts'],
  migrations: ['migrations/*.ts'],
  migrationsTableName: '__migrations',
  synchronize: false,
  logging: true,
});
 