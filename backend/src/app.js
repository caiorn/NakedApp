import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import { env } from './env.js'
import { appRoutes } from './routes.js'
import { errorHandler } from './middlewares/error-handler.js'
import { knex } from './db/knex-db.js'
import { responseDecorator } from './plugins/response-decorator.js'
// import { userSQLiteRoutes } from './modules/userSQLite/user-routes.js


export const app = fastify()

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
app.addHook('onError', async (request, reply, error) => {
  console.error('🔥 Erro na requisição:', error.message);
});

app.register(fastifyJwt, { secret: env.JWT_SECRET, sign: { expiresIn: env.JWT_EXPIRATION } });
app.register(appRoutes, { prefix: '/api' })

app.decorate('db', knex);

app.decorateRequest('currentUser', null);
app.decorateReply('success', function (statusCode, {data, message = null, meta = {}}) {
  const response = {
    success: true,
    status: statusCode || 200, //futuro dashboard, logs...
  };

  if (message) {
    response.message = message;
  }
    //[] para listas, {} objeto único e null para nada (somente em contexto)
  response.data = data;

  for (const _ in meta) {
    response.meta = meta;
    break;
  }

  response.path = this.request.raw.url;
  response.timestamp = new Date().toISOString();
  this.code(statusCode || 200).send(response);
});


app.setErrorHandler(errorHandler);

app.get('/', () => {
  return '🟢 Server running1!'
})
