import type { FastifyRequest, FastifyReply } from "fastify";
import type { UserLogged } from "../modules/shared/Usuario/user.entity.ts";
import { USER_LOGGED_COLUMNS } from "../modules/shared/Usuario/user.entity.ts";
import { UnauthorizedError, NotFoundError, PermissionError } from "../errors/all-errors.ts";
import { verifyAccessToken } from '../utils/jwt.ts';
import { cacheMemory, CacheKeys } from "../utils/cache-memory.ts";
import { UserRepository } from "../modules/shared/Usuario/user-repository.ts";

/** -----Middleware para autenticação de usuário.-------
 * Valida o JWT presente no header Authorization da requisição, verifica se o token é válido e não expirado.
 * Após validação, busca o usuário correspondente na base de dados (com cache em memória) e atribui ao request.
 */

export async function authUserHandler(request: FastifyRequest, reply: FastifyReply) {
    // Assuming Bearer token format
    const accessToken = request.headers.authorization?.split(' ')[1];

    if (!accessToken) {
        throw new UnauthorizedError("Autenticação não informada");
    }

    const payloadDecoded = await verifyAccessToken(accessToken);
    const userId = payloadDecoded?.sub;

    if (!userId) {
        throw new UnauthorizedError("Usuario não identificado na autenticação");
    }
    let user: UserLogged | undefined = cacheMemory.get(CacheKeys.USER(userId));
    if (!user) {
        [user] = await new UserRepository().selectUsersByIds({
            ids: [userId],
            columns: USER_LOGGED_COLUMNS
        });
        if (!user) {
            throw new NotFoundError("Usuario não encontrado");
        }
        if (!user.status || user.status !== 'active') {
            throw new PermissionError("Usuario não está ativo");
        }
        cacheMemory.set(CacheKeys.USER(userId), user, 1);
    }
    request.userLogged = { ...user, payload: payloadDecoded };
}