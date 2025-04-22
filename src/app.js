import fastify from 'fastify'
// import { userSQLiteRoutes } from './modules/userSQLite/user-routes.js'

const inProduction = process.env.NODE_ENV === 'production'

export const app = fastify({
	logger: !inProduction
		? {
				level: 'debug',
				transport: {
					target: 'pino-pretty',
					options: {
						colorize: true,
						translateTime: 'HH:MM:ss',
						ignore: 'pid,hostname'
					}
				}
			}
		: false // remove em produção
})
// app.register(userSQLiteRoutes, { prefix: 'users' })

app.get('/', () => {
	return '🟢 Server running!'
})
