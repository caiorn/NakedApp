import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import { env } from './env.js'
import { appRoutes } from './routes.js'
import { errorHandler } from './middlewares/error-handler.js'
// import { userSQLiteRoutes } from './modules/userSQLite/user-routes.js

export const app = fastify()
app.register(fastifyJwt, { secret: env.JWT_SECRET,	sign: { expiresIn: env.JWT_EXPIRATION }});
app.register(appRoutes, { prefix: '/api' })
app.setErrorHandler(errorHandler);

app.get('/', () => {
	return '🟢 Server running1!'
})
