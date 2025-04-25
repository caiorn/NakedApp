import { userSchema } from "./user2.schema.js";
import { UserService } from "./user-service.js";
import { UserRepository } from "./user-repository.js";
import { knex } from "../../../db/knex-db.js";
import { AppError } from "../../../errors/AppError.js";

export const createUser = async (request, reply) => {
  // validação de entrada de dados JSON se inválido, throw ZodError
  const validatedUser = userSchema.parse(request.body);

  const knexTransaction = await knex.transaction(); 
  try {
		const userRepository = new UserRepository(knexTransaction);
		const userService = new UserService(userRepository);

		const user = await userService.createUser(validatedUser);
		await knexTransaction.commit();
		reply.code(201).send(user);
	} catch (error) {
		await knexTransaction.rollback();
    throw error;
	}
};

export const getAllUsers = async (request, reply) => {
	// usar a mesma transação para todas operacoes dentro do mesmo endpoint
	const knexTransaction = await knex.transaction();
	const userRepository = new UserRepository(knexTransaction);
	const userService = new UserService(userRepository);

	await knexTransaction.commit;
	const users = await userService.getAllUsers();
	if (!users || users.length === 0) {
		throw new AppError("No users found", 404);
	}

	reply.code(200).send(users);
};

export const getUserById = async (request, reply) => {
	const userService = new UserService(new UserRepository());

	const { id } = request.params;
		const user = await userService.getUserById(id);
		if (!user) {
			return reply.code(404).send("User not found");
		}
		reply.code(200).send(user);	
};
