import fastify from 'fastify'
import cookie from '@fastify/cookie'
import cors from '@fastify/cors';
import helmet from '@fastify/helmet'

import { appRoutes } from './routes.js'
import { errorHandler } from './middlewares/error-handler.js'
import { knex } from './db/knex-db.js'

// import { userSQLiteRoutes } from './modules/userSQLite/user-routes.js

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
app.decorateRequest('userLogged', null); /* optional */
app.setErrorHandler(errorHandler);
app.get('/', () => { return '🟢 OK '})

/*
 import { successResponse, errorResponse } from './plugins/reply-decorator.js'
 app.decorateReply('success', successResponse);
 app.decorateReply('error', errorResponse);
*/