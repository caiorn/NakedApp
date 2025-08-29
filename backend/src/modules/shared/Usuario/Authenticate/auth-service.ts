import { AuthError, PermissionError, NotFoundError } from "../../../../errors/all-errors.ts";
import { UserRepository } from "../user-repository.ts";
import { AuthRepository } from "./auth-repository.ts";
import bcrypt from "bcryptjs";
import crypto from 'crypto'


export class AuthService {
	private userRepository: UserRepository;
	private authRepository: AuthRepository;
	private token: string | null;

	constructor(userRepository: UserRepository, authRepository: AuthRepository) {
		this.userRepository = userRepository;
		this.authRepository = authRepository;
		this.token = null;
	}

	async findUserByLoginAndPassword({ login, password }: { login: string; password: string; }) {
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

	async createRefreshToken(userId: number, userAgent: string | undefined, ipAddress: string) {
		const refreshToken = crypto.randomUUID(); // ou JWT se preferir
		const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 dias

		const token = {
			userId: userId,
			token: refreshToken,
			expiresAt,
			userAgent,
			ipAddress,
		};

		const [insertedToken] = await this.authRepository.insertRefreshToken(token);
		return { id: insertedToken.id, ...token };
	}

	async deleteByToken(refreshToken: string) {
		const result = await this.authRepository.destroyRefreshToken(refreshToken);
		if (result === 0) {
			throw new AuthError("Refresh token não encontrado ou já removido");
		}
	}

	async findSessionByToken(token: string) {
		const [session] = await this.authRepository.selectRefreshTokenByToken({ token });
		return session;
	}

	async createTokenResetPassword({ email }: { email: string }) {
		const user = await this.userRepository.selectUserByEmail({
			email,
			columns: ["id", "name", "status"]
		});

		if (!user || user.status === 'blocked') {
			return false; // resposta genérica para não expor usuários
		}

		const resetToken = crypto.randomBytes(32).toString("hex");
		const tokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
		const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1h

		await this.authRepository.insertPasswordResetToken({
			user_id: user.id,
			token: tokenHash,
			expires_at: expiresAt
		});
		return true;

		// const hashedPassword = await bcrypt.hash(newPassword, 8);
		// await this.userRepository.updateUserPassword(userId, hashedPassword);
		// return { message: "Password reset successfully" };
	}


	async editPasswordWithToken(inputData: { token: string; newPassword: string; }) {
		const [passwordReset] = await this.authRepository.selectPasswordResetToken({ token: inputData.token });
		if (!passwordReset) {
			throw new NotFoundError("Token de redefinição de senha inválido");
		}

		if (passwordReset.expires_at < new Date()) {
			throw new AuthError("Token de redefinição de senha expirado");
		}

		if(passwordReset.used_at) {
			throw new AuthError("Token de redefinição de senha já utilizado");
		}

		const [user] = await this.userRepository.selectUsersByIds({ 
			ids: [passwordReset.user_id], 
			columns: ["id", "name", 'status'] 
		})

		if (!user || user.status === 'blocked') {
			throw new NotFoundError("Não foi possivel alterar a senha");
		}

		await this.userRepository.updateUsersByIds({ 
			ids: [user.id], 
			userData: { 
				password: await bcrypt.hash(inputData.newPassword, 8),
				updated_by: user.id,
			} ,
			returning: ["id", "name", "login", "email"]
		});

		// dá baixa no token
		await this.authRepository.updatePasswordResetToken(passwordReset.id, { used_at: new Date() });

	}

	setToken(token: string) {
		this.token = token;
	}

	getToken() {
		return this.token;
	}

	isAuthenticated() {
		return !!this.token;
	}
}
