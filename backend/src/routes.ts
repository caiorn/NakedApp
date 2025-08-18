import type { FastifyInstance, FastifyRequest, FastifyReply, FastifyPluginOptions } from 'fastify';
import { userRoutes } from './modules/shared/Usuario/user-routes.ts'
import { authRoutes } from './modules/shared/Usuario/Authenticate/auth-routes.ts'
import { profileRoutes } from './modules/shared/Usuario/Profile/profile-routes.ts'

export async function appRoutes(fastify: FastifyInstance, _options: FastifyPluginOptions) {
    fastify.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
        console.log('➡️ Nova requisição recebida');
    });
    
    // app.addHook('onSend', async (request, reply, payload) => {  
    //   console.log('📤 Enviando resposta:', payload);
    //   return payload; // pode modificar a resposta aqui

    // });

    fastify.addHook('onResponse', async (request: FastifyRequest, reply: FastifyReply) => {
        console.log(`✅ Resposta enviada para ${request.method} ${request.url}`);
    });
    // app.addHook('onError', async (request, reply, error) => {
    //   console.error('🔥 Erro na requisição:', error.message);
    // });

    fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
        return '🟢 API running!'
    })
    fastify.register(userRoutes, { prefix: '/users' })
    fastify.register(authRoutes, { prefix: '/auth' });
    fastify.register(profileRoutes, { prefix: '/profile' });

}