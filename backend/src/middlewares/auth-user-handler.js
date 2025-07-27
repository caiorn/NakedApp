import { UnauthorizedError, NotFoundError, PermissionError} from "../errors/_errors.js";
import { verifyAccessToken } from '../utils/jwt.js';
import { cacheMemory, CacheKeys } from "../utils/cache-memory.js";
import { UserRepository } from "../modules/shared/Usuario/user-repository.js";

/** -----Middleware para autenticação de usuário.-------
 * Valida o JWT presente no header Authorization da requisição, verifica se o token é válido e não expirado.
 * Após validação, busca o usuário correspondente na base de dados (com cache em memória) e atribui ao request.
 */
export async function authUserHandler(request, reply) {
    // const token = request.cookies.sessionId
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

    let user = cacheMemory.get(CacheKeys.USER(userId));
    if (!user) {
        [user] = await new UserRepository().selectUsersByIds({
            ids: [userId],
            columns: ['id', 'name', 'status', 'login', 'email']
        });

        if (!user) {            
            throw new NotFoundError("Usuario não encontrado");
        }

        if(!user.status || user.status !== 'active') {
            throw new PermissionError("Usuario não está ativo");
        }

        cacheMemory.set(CacheKeys.USER(userId), user, 1);
    }

    request.userLogged = user;
    request.userLogged.payload = payloadDecoded;
}