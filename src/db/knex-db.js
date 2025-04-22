import knex from 'knex';
import { env } from '../env.js';

export const db = knex({
  client: 'mysql2',
  connection: env.DB_URL || {
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASS,
    database: env.DB_NAME
  },
  pool: { min: 0, max: 10 }
});
