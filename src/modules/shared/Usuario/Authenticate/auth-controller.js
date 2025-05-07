import { AppError } from '../../../../errors/AppError.js'
import { UserRepository } from '../user-repository.js';
import { authSchema } from './auth-schema.js'
import { AuthService } from './auth-service.js';
import { env } from '../../../../env.js';
import { ValidationError } from '../../../../errors/ValidationError.js';

export async function authenticateUser(request, reply) {
    const validatedUser = authSchema.safeParse(request.body);
    if (!validatedUser.success) {
        throw new ValidationError('Dados Inválidos', 401)
    }
    const { cpf, senha } = validatedUser.data;
    const authService = new AuthService(new UserRepository())
    const { user } = await authService.authenticate(cpf, senha);

    // Gerar o token JWT
    const token = await reply.jwtSign(
        { id: user.id }
    );

    reply.code(200).send({
        token,
        user,
        message: 'Login realizado com sucesso!',
    });
}