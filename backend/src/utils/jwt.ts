import jwt from "jsonwebtoken";
import { env } from "../env.ts";
import { TokenExpiredError, AuthError } from '../errors/all-errors.ts'
export function signAccessToken(userId) {
    const payload = { sub: userId };
    // @ts-ignore
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRATION });
}

export function signRefreshToken(userId) {
    const payload = { sub: userId };
    // @ts-ignore
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRATION });
}

export function verifyAccessToken(token) {
    return verifyJWT(token, env.JWT_ACCESS_SECRET);
}

export function verifyRefreshToken(token) {
    return verifyJWT(token, process.env.JWT_REFRESH_SECRET);
}

function verifyJWT(token, secret) {
    try {
        const payloadDecoded = jwt.verify(token, secret);
        return payloadDecoded;
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            throw new TokenExpiredError();
        } else if (error.name === "JsonWebTokenError") {
            throw new AuthError("Token inválido");
        } else if (error.name === "NotBeforeError") {
            throw new AuthError("Token não ativo");
        } else {
            throw new AuthError("Token verification failed");
        }
    }
}

export function decodeJWT(token) {
    return jwt.decode(token);
}