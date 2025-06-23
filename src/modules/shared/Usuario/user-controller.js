import { userSchema } from "./user.schema.js";
import { knex } from "../../../db/knex-db.js";
import { AppError } from "../../../errors/AppError.js";
import { makeUserService } from "./user-service-factory.js";
import { ValidationError } from "../../../errors/ValidationError.js";

export const createUser = async (request, reply) => {
	// validação de entrada de dados JSON se inválido, throw ZodError
	const validatedUser = userSchema.safeParse(request.body);
	if(!validatedUser.success){
		throw new ValidationError(400, "Não foi possivel criar o usúario, há campos inválidos.", validatedUser)
	}

	await knex.transaction(async (knexTransaction) => {
		const userService = makeUserService(knexTransaction);
		const user = await userService.createUser(validatedUser.data);
		reply.success(201, {
			data: user,
			message: "User created successfully"
		})
	});
};

export const setUserAvatar = async (request, reply) => {
	const { id } = request.params;
    
}

export const updateUser = async (request, reply) => {
	// const { id } = request.params;
	// const validatedUser = userSchema.parse(request.body);

	// const knexTransaction = await knex.transaction(); 
	// try {
	// 	const userService = makeUserService(knexTransaction);
	// 	const user = await userService.updateUser(id, validatedUser);
	// 	await knexTransaction.commit();
	// 	reply.code(200).send(user);
	// } catch (error) {
	// 	await knexTransaction.rollback();
	// throw error;
	// }
};


export const deleteUser = async (request, reply) => {
	// const { id } = request.params;
	// const knexTransaction = await knex.transaction(); 
	// try {
	// 	const userService = makeUserService(knexTransaction);
	// 	await userService.deleteUser(id);
	// 	await knexTransaction.commit();
	// 	reply.code(204).send();
	// } catch (error) {
	// 	await knexTransaction.rollback();
	// 	throw error;
	// }
};

export const getAllUsers = async (request, reply) => {
	const userService = makeUserService();
	const { users } = await userService.getAllUsers();
	reply.success(200, {
		data: users
	});
};

export const getUserById = async (request, reply) => {
	const userService = makeUserService();
	const { id } = request.params;
	const { user } = await userService.getUserById(id);
	reply.success(200, {
		data: user
	});
};
