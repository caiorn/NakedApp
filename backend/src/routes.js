import { userRoutes } from './modules/shared/Usuario/user-routes.js'
import { authRoutes } from './modules/shared/Usuario/Authenticate/auth-routes.js'
import { profileRoutes } from './modules/shared/Usuario/Profile/profile-routes.js'
import { verifyJWT } from './middlewares/verify-jwt.js'

export async function appRoutes(fastify, options) {
    fastify.get('/', async (request, reply) => {
        return '🟢 API running2!'
    })
    fastify.register(userRoutes, { prefix: '/users' })
    fastify.register(authRoutes, { prefix: '/auth' });
    fastify.register(profileRoutes, { prefix: '/profile' });

}