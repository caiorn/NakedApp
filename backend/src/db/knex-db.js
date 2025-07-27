import knexConfig from 'knex';
import { env } from '../env.js';

export const config = {
  client: 'better-sqlite3',
  connection: {
    filename: env.DB_URL,
  },
  useNullAsDefault: true,
  migrations: {
    tableName: '_sys_migrations',
    directory: './migrations'
  },
  seeds: {
    directory: './seeds'
  },
};

export const knex = knexConfig(config);

(await import('./knex-interceptor.js')).setupKnexInterceptors(knex, {
  enable: true,
  options: {
    errorsOnly: false,      // Log only errors SQL
    logTypes: ['SELECT', 'INSERT', 'UPDATE', 'DELETE'], // Types of SQL commands to log
    showFullSQL: false,     // false show only the operation (minify) type (e.g., SELECT, INSERT) in logs
    beatifySQL: false,       // Format SQL queries for better readability
    showResultTable: {
      enabled: true,     // Show result table in logs
      rowLimit: 5,
      columnLimit: 5
    },
  }
});