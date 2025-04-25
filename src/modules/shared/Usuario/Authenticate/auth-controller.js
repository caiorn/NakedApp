 import { AppError } from '../../../../errors/AppError.js'
import { UserRepository } from '../user-repository.js';
import { authSchema } from './auth-schema.js'
import { AuthService } from './auth-service.js';

export async function authenticateUser(request, reply) {
    const validatedUser = authSchema.safeParse(request.body);
    if (!validatedUser.success) {
        throw new AppError('User not found 1', 401);
    }
    const { cpf, senha } = validatedUser.data;
    const authService = new AuthService(new UserRepository())
    const user = await authService.authenticate(cpf, senha); 
    reply.code(200).send('User authenticated successfully');
}