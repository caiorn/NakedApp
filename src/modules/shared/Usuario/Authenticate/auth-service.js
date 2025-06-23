import { AppError } from "../../../../errors/AppError.js";
import { UserRepository } from "../user-repository.js";
import bcrypt from "bcryptjs";

export class AuthService {
	constructor(userRepository) {
		/** @type {UserRepository} */
		this.userRepository = userRepository;
		this.token = null;
	}

	async authenticate({ login, password }) {
		const user = await this.userRepository.getUserByLogin({
			login,
			columns: ["id", "login", "password", "status", "avatar"]
		});
		
		if (!user) {
			throw new AppError(401, "Usúario não encontrado");
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			throw new AppError(401, "Senha Inválida");
			//log tentativa de acesso.. senha incorreta
		}

		if (user.status !== 'active') {
			throw new AppError(403, "Acesso indisponível. Contate o seu supervisor.");
			//log tentativa de acesso.. status user
		}

		return { user };
	}

	async changePassword(userId, newPassword) {
		// const user = await this.userRepository.getUserById(userId);
		// if (!user) {
		// 	throw new AppError("User not found", 404);
		// }

		// const hashedPassword = await bcrypt.hash(newPassword, 8);
		// await this.userRepository.updateUserPassword(userId, hashedPassword);
		// return { message: "Password changed successfully" };
	}

	async resetPassword(userId, newPassword) {
		// const user = await this.userRepository.getUserById(userId);
		// if (!user) {
		// 	throw new AppError("User not found", 404);
		// }

		// const hashedPassword = await bcrypt.hash(newPassword, 8);
		// await this.userRepository.updateUserPassword(userId, hashedPassword);
		// return { message: "Password reset successfully" };
	}


	setToken(token) {
		this.token = token;
	}

	getToken() {
		return this.token;
	}

	isAuthenticated() {
		return !!this.token;
	}
}
