import * as userController from './user-controller.js'
import { verifyJWT } from '../../../middlewares/verify-jwt.js';
import { attachUserHandler } from '../../../middlewares/attach-user-handler.js';

export const userRoutes = async (fastify) => {
	// funcao qye executa antes de cada rota de usuario (middleware global dentro do escopo do plugin)
	// Aqui você pode adicionar lógica de autenticação, validação, etc.
	fastify.addHook('preHandler', async (request, reply) => {
		console.log(`[${new Date().toISOString()}] ${request.method} ${request.url}`);
	});

	fastify.get('/', async () => 'test' );

	fastify.get('/teste', {
		preHandler: [
			() => console.log("1º middleware chamado"),
			() => console.log("2º middleware chamado")]
		},
		async () => {
			return { status: 'ok' };
		});

	// Rota para buscar todos os usuários
	fastify.get('/all', { preHandler: [verifyJWT, attachUserHandler] }, userController.listAllUsers)
	// Rota para buscar usuário por ID
	fastify.get('/:id', { preHandler: [verifyJWT, attachUserHandler] }, userController.getUserById)
	// // Rota para criar um novo usuário
	fastify.post('/', { preHandler: [verifyJWT, attachUserHandler] }, userController.addUser)
	fastify.patch('/:id', { preHandler: [verifyJWT, attachUserHandler] }, userController.editUser)
	fastify.delete('/:id', { preHandler: [verifyJWT, attachUserHandler] }, userController.delUser)

	// // Rota para atualizar usuário existente
	// fastify.put('/:id', userController.updateUserController)

	// // Rota para deletar usuário
	// fastify.delete('/:id', userController.deleteUserController)
}
