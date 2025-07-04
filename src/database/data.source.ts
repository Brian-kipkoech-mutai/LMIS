import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { DataSource } from 'typeorm';

const envFile =
  process.env.NODE_ENV === 'production'
    ? '../../.env.production.local'
    : '../../.env.production.live.db';

dotenv.config({ path: resolve(__dirname, envFile) });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'lmis',
  synchronize: false,
  logging: false,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
});
