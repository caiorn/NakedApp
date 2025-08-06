import { userRoutes } from './modules/shared/Usuario/user-routes.js'
import { authRoutes } from './modules/shared/Usuario/Authenticate/auth-routes.js'
import { profileRoutes } from './modules/shared/Usuario/Profile/profile-routes.js'
import { authUserHandler } from './middlewares/auth-user-handler.js'

export async function appRoutes(fastify, options) {
    fastify.addHook('onRequest', async (request, reply) => {
        console.log('➡️ Nova requisição recebida');
    });

    // app.addHook('onSend', async (request, reply, payload) => {  
    //   console.log('📤 Enviando resposta:', payload);
    //   return payload; // pode modificar a resposta aqui

    // });

    fastify.addHook('onResponse', async (request, reply) => {
        console.log(`✅ Resposta enviada para ${request.method} ${request.url}`);
    });
    // app.addHook('onError', async (request, reply, error) => {
    //   console.error('🔥 Erro na requisição:', error.message);
    // });

    fastify.get('/', async (request, reply) => {
        return '🟢 API running!'
    })
    fastify.register(userRoutes, { prefix: '/users' })
    fastify.register(authRoutes, { prefix: '/auth' });
    fastify.register(profileRoutes, { prefix: '/profile' });

}