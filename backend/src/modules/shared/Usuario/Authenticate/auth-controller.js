import { UserRepository } from '../user-repository.js';
import { AuthRepository } from './auth-repository.js';
import { authSchema } from './auth-schema.js'
import { AuthService } from './auth-service.js';
import { BadRequestError, TokenExpiredError } from '../../../../errors/_errors.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../../../utils/jwt.js';
import { setRefreshTokenCookie, getSignedRefreshTokenValue, clearRefreshTokenCookie } from '../../../../utils/cookie-refresh-token.js';
import { success } from '../../../../utils/api-response.js';

export async function authenticateUser(request, reply) {
    const validatedUser = authSchema.safeParse(request.body);
    if (!validatedUser.success) {
        throw new BadRequestError(401, 'Dados Inválidos', validatedUser);
    }
    const { login, password } = validatedUser.data;
    const authService = new AuthService(new UserRepository())
    const { user: { id, nome, avatar } } = await authService.findUserByLoginAndPassword({ login, password });

    const accessToken = signAccessToken(id);
    const refreshToken = signRefreshToken(id);

    setRefreshTokenCookie(reply, refreshToken);

    success(reply, 200, {
        message: 'Usuário autenticado com sucesso',
        data: { token: accessToken, user: { id, nome, avatar } },
    });
}

export const refreshToken = async (request, reply) => {
    // Obtém o token de refresh do cookie
    const validTokenValue = getSignedRefreshTokenValue(request);
    const payloadDecoded = verifyRefreshToken(validTokenValue);
    const newAccessToken = signAccessToken(payloadDecoded.sub);
    const newRefreshToken = signRefreshToken(payloadDecoded.sub);

    // Atualiza o cookie
    setRefreshTokenCookie(reply, newRefreshToken);

    success(reply, 200, {
        message: 'Token atualizado com sucesso',
        data: { token: newAccessToken },
    });
};
export const refreshTokenDB = async (request, reply) => {
    // Obtém o token de refresh do cookie
    const refreshToken = request.cookies.refresh_token;
    if (!refreshToken) {
        throw new TokenExpiredError('Refresh token não informado');
    }
    const authService = new AuthService(new UserRepository(), new AuthRepository());
    const session = await authService.findSessionByToken(refreshToken);


    if (!session || Date.now() > new Date(session.expires_at).getTime()) {
        throw new TokenExpiredError('Invalid or expired refresh token');
    }

    // opcional: regenerar novo refresh token
    await authService.deleteByToken(refreshToken);

    // emite novo access_token
    const newAccessToken = signAccessToken(session.user_id);
    const newRefreshToken = await authService.createRefreshToken(session.user_id, request.headers['user-agent'], request.ip);
    setRefreshTokenCookie(reply, newRefreshToken);
    success(reply, 200, {
        message: 'Token atualizado com sucesso',
        data: { token: newAccessToken },
    });
};


export const logout = async (request, reply) => {
    // Limpa o cookie de refresh token
    clearRefreshTokenCookie(reply);
    success(reply, 200, {
        message: 'Logout realizado com sucesso',
    });
};

export const getInfoToken = async (request, reply) => {
    const userAgent = request.headers['user-agent'];
    const ip = request.headers['x-forwarded-for']?.split(',')[0] || request.ip || request.socket?.remoteAddress;
    const { payload } = request.userLogged;
    const payloadWithDates = {
        ...payload,
        iat: new Date(payload.iat * 1000), // Data de emissão
        exp: new Date(payload.exp * 1000)  // Data de expiração
    };
    success(reply, 200, {
        data: payloadWithDates
    });
};
    