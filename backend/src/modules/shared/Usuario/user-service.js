import { AppError } from "../../../errors/AppError.js";
import { UserRepository } from "./user-repository.js";
import { newUser } from "./user.schema.js";
import bcrypt from "bcryptjs";

export class UserService {
	constructor(userRepository) {
		/** @type {UserRepository} */
		this.userRepository = userRepository;
	}

	async createUser(userData, userLogged) {
		//verificar ja existe usuario com o lofin ou email		
		const [existingUser] = await this.userRepository.selectUsersByUniqueFields({
			logins: [userData.login],
			emails: [userData.email],
			columns: ["id", "login", "email"]
		});
		if (existingUser?.login === userData.login) {
			throw new AppError(409, "User with this login already exists");
		}
		if (existingUser?.email === userData.email) {
			throw new AppError(409, "User with this email already exists");
		}

		//gerando hash da senha
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(userData.password, salt);
		const newUserCopyUserData = { ...userData, password: hashedPassword };

		userData.created_by = userLogged.id;
		const [insertedUser] = await this.userRepository.insertUsers(newUserCopyUserData);
		return insertedUser;
	}

	async createUserBatch(usersData, userLogged) {
		// Verificar se há campos duplicados dentro do próprio array
		const logins = [];
		const emails = [];
		const seenLogins = new Set();
		const seenEmails = new Set();
		const duplicateErrors = [];
		for (const { login, email } of usersData) {
			const error = {};

			if (seenLogins.has(login)) error.login = login;
			else seenLogins.add(login), logins.push(login);

			if (seenEmails.has(email)) error.email = email;
			else seenEmails.add(email), emails.push(email);

			if (Object.keys(error).length) duplicateErrors.push(error);
		}

		if (duplicateErrors.length) {
			throw new AppError(400, 'Duplicate fields in batch', duplicateErrors);
		}

		// Verificar se já existem usuários com os login ou email no banco
		const existingUsers = await this.userRepository.selectUsersByUniqueFields({
			logins,
			emails,
			columns: ["id", "login", "email"]
		});

		if (existingUsers.length > 0) {
			const conflictDetails = existingUsers.map(user => {
				const conflicts = {};
				if (logins.includes(user.login)) {
					conflicts.login = user.login;
				}
				if (emails.includes(user.email)) {
					conflicts.email = user.email;
				}
				return conflicts;
			});
			throw new AppError(409, `Some users already exist`, conflictDetails);
		}

		// Gerar hash das senhas após validações
		const usersWithHashedPasswords = [];
		for (const user of usersData) {
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(user.password, salt);
			usersWithHashedPasswords.push({ ...user, password: hashedPassword, created_by: userLogged.id });
		}

		const insertedUsers = await this.userRepository.insertUsers(usersWithHashedPasswords);
		return insertedUsers;
	}

	async findAllUsers() {
		const columns = ["id", "name", "login", "email", "phone"];
		const users = await this.userRepository.selectAllUsers({ columns });
		return { users };
	}

	async findUserById(id) {
		const columns = ["id", "name", "login", "email", "phone"];
		const [user] = await this.userRepository.selectUsersByIds({ ids: [id], columns });
		if (!user) {
			throw new AppError(404, "User not found");
		}
		return { user };
	}

	async changeUser(id, userData, userLogged) {
		// Validar se o usuário existe
		const columns = ["id", "name", "login", "email", "phone"];
		const [user] = await this.userRepository.selectUsersByIds({ ids: [id], columns});
		if (!user) {
			throw new AppError(404, "User not found");
		}

		// Verificar se já existe usuário com o login ou email
		const existingUsers = await this.userRepository.selectUsersByUniqueFields({
			logins: [userData.login],
			emails: [userData.email],
			columns: ["id", "login", "email"]
		});
		
		for (const existingUser of existingUsers) {
			if (existingUser.login === userData.login && existingUser.id !== id) {
				throw new AppError(409, "User with this login already exists");
			}
			if (existingUser.email === userData.email && existingUser.id !== id) {
				throw new AppError(409, "User with this email already exists");
			}
		}
		// Atualizar os dados do usuário
		userData.updated_by = userLogged.id;
		const affectedRows = await this.userRepository.updateUsersByIds([id], userData);
		return affectedRows;
	}

	async deleteUser(id) {
		const [user] = await this.userRepository.selectUsersByIds({ ids: [id], columns: ["id"] });
		if (!user) {
			throw new AppError(404, "User not found");
		}
		const affectedRows = await this.userRepository.destroyUsersSoftly([id]);
		return affectedRows;
	}
}
