import * as userController from './user-controller.js'

export const userRoutes = async (fastify) => {
	// Rota para buscar todos os usuários
	fastify.get('/', userController.getAllUsersController)

	// Rota para buscar usuário por ID
	fastify.get('/:id', userController.getUserByIdController)

	// Rota para criar um novo usuário
	fastify.post('/', userController.createUserController)

	// Rota para atualizar usuário existente
	fastify.put('/:id', userController.updateUserController)

	// Rota para deletar usuário
	fastify.delete('/:id', userController.deleteUserController)
}
