// import * as userController from './user-controller.js'
import { knex } from '../../../db/knex-db.js'

export const userRoutes = async (fastify) => {
	// Rota para buscar todos os usuários
	fastify.get('/', async () => {
		// const users = await knex('users').select('*').whereNull('deleted_at');
		const columnInfo = await knex('users').columnInfo();
		return columnInfo
	});

	// fastify.get('/', userController.getAllUsersController)

	// // Rota para buscar usuário por ID
	// fastify.get('/:id', userController.getUserByIdController)

	// // Rota para criar um novo usuário
	// fastify.post('/', userController.createUserController)

	// // Rota para atualizar usuário existente
	// fastify.put('/:id', userController.updateUserController)

	// // Rota para deletar usuário
	// fastify.delete('/:id', userController.deleteUserController)
}
