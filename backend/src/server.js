import { env } from './env.js';
import { app } from './app.js';
import { knex } from './db/knex-db.js';

async function start() {
	try {
		// const result = await knex.raw('SELECT sqlite_version() AS version;');
		// await knex.migrate.latest();           // migrations
		// console.info(`🟢 Migrações aplicadas, Versão SQLite: ${result[0]?.version || 'desconhecida'}`);

		await app.listen({ port: env.PORT, host: env.HOST });
		console.info(`🟢 Servidor rodando em http://${env.HOST}:${env.PORT}`);
	} catch (err) {
		console.error('🔴 Falha ao iniciar:', err);
		process.exit(1);
	}
}

start();