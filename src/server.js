import { env } from './env.js'
import { app } from './app.js'
import { test } from './db/connetionTest.js'

//await test.ConnectionMySQL2();
test.ConnectionKnex();
app.listen({ port: env.PORT, host: env.HOST }).then(async () => {
	const local = `http://localhost:${env.PORT}`
	console.info(`🟢 Server running locally at: ${local}`)
}).catch((error) => {
	console.error('🔴 Error starting server:', error)
})
