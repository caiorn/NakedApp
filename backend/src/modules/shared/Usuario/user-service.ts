import type { NewUser, NewUsers, EditUser, UpdateUser, EditUserProfile  } from "./user.schema.ts";
import type { UserLogged  } from "../../../types/UserLogged.ts";	

import { NotFoundError, ConflictError } from "../../../errors/all-errors.ts";
import { UserRepository } from "./user-repository.ts";
import bcrypt from "bcryptjs";

export class UserService {
	private userRepository: UserRepository;
	constructor(userRepository : UserRepository) {
		this.userRepository = userRepository;
	}

	async createUser(userData : NewUser, userLogged : UserLogged) {
		//verificar ja existe usuario com o lofin ou email		
		const [existingUser] = await this.userRepository.selectUsersByUniqueFields({
			logins: [userData.login],
			emails: [userData.email],
			columns: ["id", "login", "email"]
		});
		if (existingUser?.login === userData.login) {
			throw new ConflictError("User with this login already exists");
		}
		if (existingUser?.email === userData.email) {
			throw new ConflictError("User with this email already exists");
		}

		//gerando hash da senha
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(userData.password, salt);
		const updatedUserData = { 
			...userData, 
			password: hashedPassword,
			created_by: userLogged.id 
		};
		const [insertedUser] = await this.userRepository.insertUsers(updatedUserData);
		return insertedUser;
	}

	async createUserBatch(usersData : NewUsers, userLogged : UserLogged) {
		// Verificar se há campos duplicados dentro do próprio array
		const logins: string[] = [];
		const emails: string[] = [];
		const seenLogins = new Set();
		const seenEmails = new Set();
		const duplicateErrors: { field: string; message: string }[] = [];
		for (const { login, email } of usersData) {
			if (seenLogins.has(login)) {
				duplicateErrors.push({ field: "login", message: `Duplicate login: ${login}` });
			} else {
				seenLogins.add(login);
				logins.push(login);
			}

			if (seenEmails.has(email)) {
				duplicateErrors.push({ field: "email", message: `Duplicate email: ${email}` });
			} else {
				seenEmails.add(email);
				emails.push(email);
			}
		}

		if (duplicateErrors.length) {
			throw new ConflictError('Duplicate fields in batch', duplicateErrors);
		}

		// Verificar se já existem usuários com os login ou email no banco
		const existingUsers = await this.userRepository.selectUsersByUniqueFields({
			logins,
			emails,
			columns: ["id", "login", "email"]
		});

		if (existingUsers.length > 0) {
			const conflictDetails = existingUsers.flatMap(user => {
				const conflicts: { field: string; message: string }[] = [];
				if (logins.includes(user.login)) {
					conflicts.push({ field: "login", message: `User with login ${user.login} already exists` });
				}
				if (emails.includes(user.email)) {
					conflicts.push({ field: "email", message: `User with email ${user.email} already exists` });
				}
				return conflicts;
			});
			throw new ConflictError(`Some users already exist`, conflictDetails);
		}

		// Gerar hash das senhas após validações
		const usersWithHashedPasswords: Array<NewUser & { created_by: number }> = await Promise.all(
			usersData.map(async (user) => {
				const salt = await bcrypt.genSalt(10);
				const hashedPassword = await bcrypt.hash(user.password, salt);
				return { ...user, password: hashedPassword, created_by: userLogged.id };
			})
		);

		const insertedUsers = await this.userRepository.insertUsers(usersWithHashedPasswords);
		return insertedUsers;
	}

	async findAllUsers() {
		const columns = ["id", "name", "login", "email", "phone"];
		const users = await this.userRepository.selectAllUsers({ columns });
		return { users };
	}

	async findUserById(id : number) {
		const columns = ["id", "name", "login", "email", "phone"];
		const [user] = await this.userRepository.selectUsersByIds({ ids: [id], columns });
		if (!user) {
			throw new NotFoundError("User not found");
		}
		return { user };
	}

	async changeUser(id : number, userData : EditUser, userLogged : UserLogged) {
		// Validar se o usuário existe
		const columns = ["id", "name", "login", "email", "phone"];
		const [user] = await this.userRepository.selectUsersByIds({ ids: [id], columns});
		if (!user) {
			throw new NotFoundError("User not found");
		}

		// Verificar se já existe usuário com o login ou email
		const existingUsers = await this.userRepository.selectUsersByUniqueFields({
			logins: userData.login ? [userData.login] : [],
			emails: userData.email ? [userData.email] : [],
			columns: ["id", "login", "email"]
		});
		
		for (const existingUser of existingUsers) {
			if (existingUser.login === userData.login && existingUser.id !== id) {
				throw new ConflictError("User with this login already exists");
			}
			if (existingUser.email === userData.email && existingUser.id !== id) {
				throw new ConflictError("User with this email already exists");
			}
		}
		// Atualizar os dados do usuário
		const updatedUserData: UpdateUser = {
			...userData,
			updated_by: userLogged.id
		};
		const affectedRows = await this.userRepository.updateUsersByIds([id], updatedUserData);
		return affectedRows;
		// 	const [updatedUser] = await this.userRepository.updateUsersByIds([id], userData);
		// return updatedUser;
	}

	async deleteUser(id : number) {
		const [user] = await this.userRepository.selectUsersByIds({ ids: [id], columns: ["id"] });
		if (!user) {
			throw new NotFoundError("User not found");
		}
		const affectedRows = await this.userRepository.destroyUsersSoftly([id]);
		return affectedRows;
	}
}
