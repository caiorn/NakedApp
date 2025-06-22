import { AppError } from "../../../errors/AppError.js";
import { UserRepository } from "./user-repository.js";
import { userSchema } from "./user.schema.js";
import bcrypt from "bcryptjs";

/**
 * @typedef {import('zod').infer<typeof userSchema>} User
 */
export class UserService {
	constructor(userRepository) {
		/** @type {UserRepository} */
		this.userRepository = userRepository;
	}

	/**
	 * @param {User} userData
	 */
	async createUser(userData) {
		// const newUser = { ...userData }; // Cria uma cópia do objeto userData
		
		//verificar ja existe usuario com esta matricula ou cpf		
		const existingUser = await this.userRepository.getUserByUniqueFields({
			login: userData.login,
			email: userData.email,
			columns: ["id", "login", "email"]
		});
		if( existingUser?.login === userData.login) {
			throw new AppError("User with this login already exists", 409);
		}
		if (existingUser?.email === userData.email) {
			throw new AppError("User with this email already exists", 409);
		}
		

		//gerando hash da senha
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(userData.password, salt);
		// Criar novo objeto com a senha alterada
		const newUser = { ...userData, senha: hashedPassword }; //copia para não refletir no objeto original
		const result = await this.userRepository.createUser(newUser);
		return result;
	}

	async getAllUsers() {
		const users = await this.userRepository.getAllUsers();
		return { users };
	}

	async getUserById(id) {
		const user = await this.userRepository.getUserById(id);
		return { user };
	}
}
