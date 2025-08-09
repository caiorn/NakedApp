import type { FastifyRequest, FastifyReply } from "fastify"; 
import * as userSchema from "./user.schema.ts";
import { makeUserService } from "./user-service-factory.ts";
import { BadRequestError } from "../../../errors/BadRequestError.ts";
import { cacheMemory, CacheKeys } from "../../../utils/cache-memory.ts";

export const addUser = async (request: FastifyRequest, reply: FastifyReply) => {
	const userLogged = request.userLogged!;
	const isArray = Array.isArray(request.body);
	const schema = isArray ? userSchema.newUsers : userSchema.newUser;

	const validatedUser = schema.safeParse(request.body);
	if (!validatedUser.success) {
		throw new BadRequestError(400, "Não foi possivel criar o usúario, há campos inválidos.", validatedUser);
	}

	await request.server.db.transaction(async (knexTransaction) => {
		const userService = makeUserService(knexTransaction);
		const users = isArray
			? await userService.createUserBatch(validatedUser.data as userSchema.NewUser[], userLogged)
			: await userService.createUser(validatedUser.data as userSchema.NewUser, userLogged);

		const message = isArray ? "Users created successfully" : "User created successfully";
		reply.success(201, { message, data: users });
	});
};

export const setUserAvatar = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
	const { id } = request.params;

};

export const editUser = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
	const userToEditID = Number(request.params.id);
	const userLogged = request.userLogged!;
	if (!Number.isInteger(userToEditID) || userToEditID <= 0) {
		throw new BadRequestError(400, "ID do usuário deve ser um número inteiro positivo.", request.params.id);
	}

	const validatedUser = userSchema.editUser.safeParse(request.body);
	if (!validatedUser.success) {
		throw new BadRequestError(400, "Não foi possivel atualizar o usúario, há campos inválidos.", validatedUser)
	}

	const knexTransaction = await request.server.db.transaction();
	try {
		const userService = makeUserService(knexTransaction);
		const affectedRows = await userService.changeUser(userToEditID, validatedUser.data, userLogged);
		await knexTransaction.commit();
		cacheMemory.delete(CacheKeys.USER(userToEditID));
		reply.success(200, {
			data: affectedRows,
			message: `User updated successfully`
		});
	} catch (error) {
		await knexTransaction.rollback();
		throw error;
	}
};


export const delUser = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
	const id = Number(request.params.id);
	if (!Number.isInteger(id) || id <= 0) {
		throw new BadRequestError(400, "ID do usuário deve ser um número inteiro positivo.", request.params.id);
	}
	await request.server.db.transaction(async (knexTransaction) => {
		const userService = makeUserService(knexTransaction);
		await userService.deleteUser(id);
		cacheMemory.delete(CacheKeys.USER(id));
		reply.success(200, {
			message: `User deleted successfully`
		});
	});
};

export const listAllUsers = async (request: FastifyRequest, reply: FastifyReply) => {
	const { userLogged } = request;
	const userService = makeUserService();
	const { users } = await userService.findAllUsers();
	reply.success(200, {
		data: users
	});
};

export const getMe = async (request: FastifyRequest, reply: FastifyReply) => {
	const { userLogged } = request;
	if (!userLogged) {
		throw new BadRequestError(404, "User not found", undefined);
	}
	reply.success(200, {
		data: userLogged
	});
};

export const getUserById = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
	const userService = makeUserService();
	const userToSearchID = Number(request.params.id);
	if (!Number.isInteger(userToSearchID) || userToSearchID <= 0) {
		throw new BadRequestError(400, "ID do usuário deve ser um número inteiro positivo.", request.params.id);
	}
	const { user } = await userService.findUserById(userToSearchID);
	reply.success(200, {
		data: user
	});
};
