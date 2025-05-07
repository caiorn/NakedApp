import knexConfig from 'knex';
import { env } from '../env.js';

export const config = {
  client: 'mysql2',
  connection: env.DB_URL,
  pool: { min: 0, max: 10 },
  migrations: {}
}

export const knex = knexConfig(config);
