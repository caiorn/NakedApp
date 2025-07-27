import * as userController from './user-controller.js'
import { authUserHandler } from '../../../middlewares/auth-user-handler.js';

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

	fastify.get('/me', { preHandler: authUserHandler }, userController.getMe); 			// Rota para obter informações do usuário logad
	fastify.get('/all', { preHandler: authUserHandler }, userController.listAllUsers); 	// Rota para buscar todos os usuários
	fastify.get('/:id', { preHandler: authUserHandler }, userController.getUserById); 	// Rota para buscar usuário por ID

	fastify.post('/', { preHandler: authUserHandler }, userController.addUser) 	// // Rota para criar um novo usuário
	fastify.patch('/:id', { preHandler: authUserHandler }, userController.editUser)
	fastify.delete('/:id', { preHandler: authUserHandler }, userController.delUser)

	// // Rota para atualizar usuário existente
	// fastify.put('/:id', userController.updateUserController)

	// // Rota para deletar usuário
	// fastify.delete('/:id', userController.deleteUserController)
}
