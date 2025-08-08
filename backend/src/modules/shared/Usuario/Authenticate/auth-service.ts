import { AuthError, PermissionError, } from "../../../../errors/all-errors.ts";
import { UserRepository } from "../user-repository.ts";
import { AuthRepository } from "./auth-repository.ts";
import bcrypt from "bcryptjs";
import { randomUUID } from 'crypto'


export class AuthService {
	constructor(userRepository, authRepository) {
		/** @type {UserRepository} */
		this.userRepository = userRepository;
		/** @type {AuthRepository} */
		this.authRepository = authRepository;
		this.token = null;
	}

	async findUserByLoginAndPassword({ login, password }) {
		const user = await this.userRepository.selectUserByLogin({
			login,
			columns: ["id", "name", "password", "status", "avatar"]
		});

		if (!user) {
			throw new AuthError("Usúario não encontrado");
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			throw new AuthError("Senha Inválida");
			//log tentativa de acesso.. senha incorreta
		}

		if (user.status !== 'active') {
			throw new PermissionError("Acesso indisponível. Contate o seu supervisor.");
			//log tentativa de acesso.. status user
		}

		return { user };
	}

	async createRefreshToken(userId, userAgent, ipAddress) {
		const refreshToken = randomUUID(); // ou JWT se preferir
		const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 dias

		const token = {
			userId: userId,
			token: refreshToken,
			expiresAt,
			userAgent,
			ipAddress,
		};

		const [insertedToken] = await this.authRepository.insertRefreshToken(token);
		return { id: insertedToken.id, ...token  };
	}

    async deleteByToken(refreshToken) {
        const result =  await this.authRepository.destroyRefreshToken(refreshToken);
		if (result === 0) {
			throw new AuthError("Refresh token não encontrado ou já removido");
		}
    }

	async findSessionByToken(token) {
		const [session] = await this.authRepository.selectRefreshTokenByToken({ token });
		return session;
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
