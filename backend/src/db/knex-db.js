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

// Exemplo de interceptor: log de todas as queries
knex.on('query', (query) => {
  console.debug('> SQL:', query.sql, query.bindings || '');
});

// Interceptor de erro
knex.on('query-error', (error, obj) => {
  console.error('! SQL Error:', error, obj.sql);
});