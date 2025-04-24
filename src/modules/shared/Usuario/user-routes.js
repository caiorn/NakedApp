import * as userController from './user-controller.js'
import { knex } from '../../../db/knex-db.js'

export const userRoutes = async (fastify) => {

	// funcao qye executa antes de cada rota de usuario (middleware global dentro do escopo do plugin)
	// Aqui você pode adicionar lógica de autenticação, validação, etc.
	fastify.addHook('preHandler', async (request, reply) => {
		console.log(`[${new Date().toISOString()}] ${request.method} ${request.url}`);
		// Verifica se o usuário está autenticado
		// if (!request.user) {
		// 	return reply.status(401).send({ message: 'Unauthorized' });
		// }
	});


	fastify.get('/teste', {preHandler: [()=>console.log("middleware chamado")]}, async () => {
		return { status: 'ok' };
	});

	// Rota para buscar todos os usuários
	fastify.get('/', async () => {
		const users = await knex('users').select('*')//.whereNull('deleted_at');
		return users;
	});

	fastify.get('/all', userController.getAllUsers)

	// Rota para buscar usuário por ID
	fastify.get('/:id', userController.getUserById)

	// // Rota para criar um novo usuário
	 fastify.post('/', userController.createUser)

	// // Rota para atualizar usuário existente
	// fastify.put('/:id', userController.updateUserController)

	// // Rota para deletar usuário
	// fastify.delete('/:id', userController.deleteUserController)
}
