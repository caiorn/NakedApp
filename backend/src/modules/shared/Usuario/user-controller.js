import * as userSchema from "./user.schema.js";
import { knex } from "../../../db/knex-db.js";
import { makeUserService } from "./user-service-factory.js";
import { BadRequestError } from "../../../errors/BadRequestError.js";
import { cacheMemory, CacheKeys } from "../../../utils/cache-memory.js";
import { success } from "../../../utils/api-response.js";


export const addUser = async (request, reply) => {
	const { userLogged } = request;
	const isArray = Array.isArray(request.body);
	const schema = isArray ? userSchema.newUsers : userSchema.newUser;
	
	const validatedUser = schema.safeParse(request.body);
	if (!validatedUser.success) {
		throw new BadRequestError(400, "Não foi possivel criar o usúario, há campos inválidos.", validatedUser);
	}

	await knex.transaction(async (knexTransaction) => {
		const userService = makeUserService(knexTransaction);		
		const users = isArray 
			? await userService.createUserBatch(validatedUser.data, userLogged)
			: await userService.createUser(validatedUser.data, userLogged);

		const message = isArray ? "Users created successfully" : "User created successfully";
		success(reply, 201, { message, data: users });
	});
};

export const setUserAvatar = async (request, reply) => {
	const { id } = request.params;

};

export const editUser = async (request, reply) => {
	const { id } = request.params;
	const userId = Number(id);
	if (!Number.isInteger(userId) || userId <= 0) {
		throw new BadRequestError(400, "ID do usuário deve ser um número inteiro positivo.", id);
	}

	const validatedUser = userSchema.editUser.safeParse(request.body);
	if (!validatedUser.success) {
		throw new BadRequestError(400, "Não foi possivel atualizar o usúario, há campos inválidos.", validatedUser)
	}

	const knexTransaction = await knex.transaction();
	try {
		const userService = makeUserService(knexTransaction);
		const affectedRows = await userService.changeUser(userId, validatedUser.data, request.userLogged);
		await knexTransaction.commit();
		cacheMemory.delete(CacheKeys.USER(userId));
		reply.success(200, {
			data: affectedRows,
			message: `User updated successfully`
		});
	} catch (error) {
		await knexTransaction.rollback();
		throw error;
	}
};


export const delUser = async (request, reply) => {
	const { id } = request.params;
	const knexTransaction = await knex.transaction(); 

	await knex.transaction(async (knexTransaction) => {
		const userService = makeUserService(knexTransaction);
		await userService.deleteUser(id);
		cacheMemory.delete(CacheKeys.USER(id));
		success(reply, 200, {
			message: `User deleted successfully`
		});
	});
};

export const listAllUsers = async (request, reply) => {
	const { userLogged } = request;
	const userService = makeUserService();
	const { users } = await userService.findAllUsers();
	success(reply, 200, {
		data: users
	});
};

export const getMe = async (request, reply) => {
	const { userLogged } = request;
	if (!userLogged) {
		throw new BadRequestError(404, "User not found");
	}
	success(reply, 200, {
		data: userLogged
	});
};

export const getUserById = async (request, reply) => {
	const userService = makeUserService();
	const { id } = request.params;
	const { user } = await userService.findUserById(id);
	success(reply, 200, {
		data: user
	});
};
