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
		
		//verificar ja existe usuario com o lofin ou email		
		const existingUser = await this.userRepository.getUserByUniqueFields({
			login: userData.login,
			email: userData.email,
			columns: ["id", "login", "email"]
		});
		if( existingUser?.login === userData.login) {
			throw new AppError(409, "User with this login already exists");
		}
		if (existingUser?.email === userData.email) {
			throw new AppError(409, "User with this email already exists");
		}	

		//gerando hash da senha
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(userData.password, salt);
		const newUserCopyUserData = { ...userData, password: hashedPassword };
		const result = await this.userRepository.createUser(newUserCopyUserData);
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
