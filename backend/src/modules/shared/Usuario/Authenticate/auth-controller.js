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
    const { user: {id, nome, avatar} } = await authService.findUserByLoginAndPassword({ login, password });
    const token = await reply.jwtSign( { sub: id } );
    reply.success(200, { 
        message: 'Usuário autenticado com sucesso',
        data: { token, user: { id, nome, avatar } } 
    });
}

export const getInfoToken = async (request, reply) => {
    const { user } = request;
    const payload = {
        ...user,
        iat: new Date(user.iat * 1000), // Data de emissão
        exp: new Date(user.exp * 1000)  // Data de expiração
    };
    reply.success(200, {
        data: payload
    });
};
