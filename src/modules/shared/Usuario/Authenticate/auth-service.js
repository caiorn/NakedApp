import { AppError } from "../../../../errors/AppError.js";
import { UserRepository } from "../user-repository.js";
import bcrypt from "bcryptjs";

export class AuthService {
	constructor(userRepository) {
		/** @type {UserRepository} */
		this.userRepository = userRepository;
		this.token = null;
	}

	async authenticate(cpf, password) {
		const user = await this.userRepository.getUserByCPF(cpf);
		if (!user) {
			throw new AppError("User not found 2", 401);
		}

		const isPasswordValid = await bcrypt.compare(password, user.senha);
		if (!isPasswordValid) {
			throw new AppError("Invalid password", 409);
		}

		if (user.status !== "active") {
			throw new AppError("User is not active", 401);
		}

        return { user };
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
