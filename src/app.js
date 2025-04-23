import fastify from 'fastify'
import { userRoutes } from './modules/shared/Usuario/user-routes.js'
// import { userSQLiteRoutes } from './modules/userSQLite/user-routes.js'

const inProduction = process.env.NODE_ENV === 'production'

export const app = fastify()


app.register(userRoutes, { prefix: 'users' })

app.get('/', () => {
	return '🟢 Server running!'
})
