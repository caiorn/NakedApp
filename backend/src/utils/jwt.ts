import jwt from "jsonwebtoken";
import { env } from "../env.ts";
import { TokenExpiredError, AuthError } from '../errors/all-errors.ts'

type JWTPayload = { 
    sub: string 
};

export function signAccessToken(userId: string) {
    const payload : JWTPayload = { sub: userId };
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRATION });
}

export function signRefreshToken(userId: string) {
    const payload : JWTPayload = { sub: userId };
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRATION });
}

export function verifyAccessToken(token: string) {
    return verifyJWT(token, env.JWT_ACCESS_SECRET);
}
 
export function verifyRefreshToken(token: string) {
    return verifyJWT(token, env.JWT_REFRESH_SECRET);
}

function verifyJWT(token: string, secret: string) {
    try {
        const payloadDecoded = jwt.verify(token, secret);
        return payloadDecoded as JWTPayload & { iat: number; exp: number };
    } catch (error: unknown) {
        if (typeof error === "object" && error !== null && "name" in error) {
            const err = error as { name: string };
            if (err.name === "TokenExpiredError") {
                throw new TokenExpiredError();
            } else if (err.name === "JsonWebTokenError") {
                throw new AuthError("Token inválido");
            } else if (err.name === "NotBeforeError") {
                throw new AuthError("Token não ativo");
            } else {
                throw new AuthError("Token verification failed");
            }
        }
        throw new AuthError("Token verification failed");
    }
}

export function decodeJWT(token: string) {
    return jwt.decode(token);
}