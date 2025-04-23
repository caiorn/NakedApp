import knexConfig from 'knex';
import { env } from '../env.js';

export const config = {
  client: 'mysql2',
  connection: env.DB_URL || {
    
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASS,
    database: env.DB_NAME
  },
  pool: { min: 0, max: 10 },
  migrations: {}
}

export const knex = knexConfig(config);
