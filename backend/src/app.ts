import fastify from 'fastify'
import cookie from '@fastify/cookie'
import cors from '@fastify/cors';
import helmet from '@fastify/helmet'

import { appRoutes } from './routes.ts'
import { errorHandler } from './middlewares/error-handler.ts'
import { knex } from './db/knex-db.ts'
 import { success, fail } from './plugins/reply-decorators.ts'

// import { userSQLiteRoutes } from './modules/userSQLite/user-routes.ts

export const app = fastify();
app.register(helmet);
app.register(cors, {
  origin: true, // permite todas as origens
  credentials: true, // permite cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // métodos permitidos
});
app.register(cookie, { secret: process.env.COOKIE_SECRET });
app.register(appRoutes, { prefix: '/api' })
app.decorate('db', knex);
app.decorateRequest('userLogged', undefined); /* optional */
app.decorateReply('success', success);
app.decorateReply('fail', fail);

app.setErrorHandler(errorHandler);
app.get('/', () => { return '🟢 OK '})