import { AppError } from '../../../../errors/AppError.js'
import { UserRepository } from '../user-repository.js';
import { authSchema } from './auth-schema.js'
import { AuthService } from './auth-service.js';
import { ValidationError } from '../../../../errors/ValidationError.js';

export async function authenticateUser(request, reply) {
    const validatedUser = authSchema.safeParse(request.body);
    if (!validatedUser.success) {
        throw new ValidationError(401, 'Dados Inválidos', validatedUser);
    }
    const { login, password } = validatedUser.data;
    const authService = new AuthService(new UserRepository())
    const { user } = await authService.authenticate({ login, password });

    // Gerar o token JWT
    const token = await reply.jwtSign(
        { id: user.id }
    );

    reply.success(200, { 
        message: 'Usuário autenticado com sucesso',
        data: { user, token } 
    });
}