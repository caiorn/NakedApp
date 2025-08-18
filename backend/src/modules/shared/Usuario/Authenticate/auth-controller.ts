import type { FastifyReply, FastifyRequest } from 'fastify';
import { makeAuthService } from './auth-service-factory.ts';
import { authSchema } from './auth-schema.ts'
import { BadRequestError, TokenExpiredError } from '../../../../errors/all-errors.ts';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../../../utils/jwt.ts';
import {
    setRefreshTokenCookie,
    getSignedRefreshTokenValue,
    clearRefreshTokenCookie
} from '../../../../utils/cookie-refresh-token.ts';
import { success } from '../../../../utils/api-response.ts';

export async function authenticateUser(request: FastifyRequest, reply: FastifyReply) {
    const validatedUser = authSchema.safeParse(request.body);
    if (!validatedUser.success) {
        throw new BadRequestError(401, 'Dados Inválidos', validatedUser);
    }
    const { login, password } = validatedUser.data;
    const authService = makeAuthService();
    const { user: { id, name, avatar } } = await authService.findUserByLoginAndPassword({ login, password });

    const accessToken = signAccessToken(id.toString());
    const refreshToken = signRefreshToken(id.toString());

    setRefreshTokenCookie(reply, refreshToken);

    success(reply, 200, {
        message: 'Usuário autenticado com sucesso',
        data: { token: accessToken, user: { id, name, avatar } },
    });
}

export const refreshToken = async (request: FastifyRequest, reply: FastifyReply) => {
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
export const refreshTokenDB = async (request: FastifyRequest, reply: FastifyReply) => {
    // Obtém o token de refresh do cookie
    const refreshToken = request.cookies.refresh_token;
    if (!refreshToken) {
        throw new TokenExpiredError('Refresh token não informado');
    }
    const authService = makeAuthService();
    const session = await authService.findSessionByToken(refreshToken);


    if (!session || Date.now() > new Date(session.expires_at).getTime()) {
        throw new TokenExpiredError('Invalid or expired refresh token');
    }

    // opcional: regenerar novo refresh token
    await authService.deleteByToken(refreshToken);

    // emite novo access_token
    const newAccessToken = signAccessToken(session.user_id);
    const newRefreshToken = await authService.createRefreshToken(session.user_id, request.headers['user-agent'], request.ip);
    setRefreshTokenCookie(reply, newRefreshToken.token);
    success(reply, 200, {
        message: 'Token atualizado com sucesso',
        data: { token: newAccessToken },
    });
};


export const logout = async (request: FastifyRequest, reply: FastifyReply) => {
    // Limpa o cookie de refresh token
    clearRefreshTokenCookie(reply);
    success(reply, 200, {
        message: 'Logout realizado com sucesso',
    });
};

export const getInfoToken = async (request: FastifyRequest, reply: FastifyReply) => {
    const userAgent = request.headers['user-agent'];
    const forwardedFor = request.headers['x-forwarded-for'];
    const ip = (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor?.split(',')[0]) || request.ip || request.socket?.remoteAddress;
    const { payload } = request.userLogged!;
    const payloadWithDates = {
        ...payload,
        iat: new Date(payload.iat * 1000), // Data de emissão
        exp: new Date(payload.exp * 1000)  // Data de expiração
    };
    success(reply, 200, {
        data: payloadWithDates
    });
};
