import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { appRoutes } from './routes.js'
import { errorHandler } from './middlewares/error-handler.js'
import { knex } from './db/knex-db.js'
// import { userSQLiteRoutes } from './modules/userSQLite/user-routes.js


export const app = fastify()

app.register(cookie, {
  secret: process.env.COOKIE_SECRET || 'default_secret', // Use a secure secret in production
});
app.addHook('onRequest', async (request, reply) => {
  console.log('➡️ Nova requisição recebida');
});

// app.addHook('onSend', async (request, reply, payload) => {  
//   console.log('📤 Enviando resposta:', payload);
//   return payload; // pode modificar a resposta aqui

// });

app.addHook('onResponse', async (request, reply) => {
  console.log(`✅ Resposta enviada para ${request.method} ${request.url}`);
});
// app.addHook('onError', async (request, reply, error) => {
//   console.error('🔥 Erro na requisição:', error.message);
// });

app.register(appRoutes, { prefix: '/api' })

app.decorate('db', knex);
app.decorateRequest('userLogged', null);
app.setErrorHandler(errorHandler);

app.get('/', () => {
  return '🟢 Server running1!'
})
/*
 import { successResponse, errorResponse } from './plugins/reply-decorator.js'
 app.decorateReply('success', successResponse);
 app.decorateReply('error', errorResponse);
*/