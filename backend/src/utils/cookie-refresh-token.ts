import type { FastifyReply, FastifyRequest } from 'fastify'
import type { CookieSerializeOptions } from '@fastify/cookie'
import ms from "ms";
import { env } from '../env.ts';
import { TokenExpiredError } from '../errors/TokenExpiredError.ts';
import { scramble, unscramble } from './str-obfuscate.ts';

const _REFRESH_TOKEN_COOKIE = 'refresh_token';

const _refreshTokenCookieOptions : CookieSerializeOptions = {
    signed: true,           // assina o cookie (usa a secret definida antes)
    httpOnly: true,         // evita acesso por JavaScript (protege contra XSS) 
    secure: env.inProduction,  // só é enviado via HTTPS (produção)
    sameSite: 'strict',     // não compartilha em requisições de outros domínios
    path: 'api/auth/refresh',              // cookie é válido em toda a aplicação
    maxAge:  ms(env.JWT_REFRESH_EXPIRATION) / 1000 // para segundos
};

// Define o cookie de refresh token na resposta
export function setRefreshTokenCookie(reply: FastifyReply, token: string) {
    const scrambledToken = scramble(token);
    reply.setCookie(_REFRESH_TOKEN_COOKIE, scrambledToken, _refreshTokenCookieOptions);
}

// Limpa o cookie de refresh token na resposta
export function clearRefreshTokenCookie(reply: FastifyReply) {
    reply.clearCookie(_REFRESH_TOKEN_COOKIE);
}

// Obtém e valida um cookie assinado e retorna seu valor
export function getSignedRefreshTokenValue(request: FastifyRequest) {
    const signedCookie = request.cookies[_REFRESH_TOKEN_COOKIE];
    if (!signedCookie) {
        throw new TokenExpiredError(`Refresh token expirado`);
    }
    const { valid: tokenIsValid, value: tokenValue } = request.unsignCookie(signedCookie);
    if (!tokenIsValid) {
        throw new TokenExpiredError(`Refresh token inválido.`);
    }
    const unscrambledToken = unscramble(tokenValue);
    return unscrambledToken;
}


/*
    HttpOnly: o frontend não consegue acessar o cookie via JavaScript, mas ele é automaticamente enviado nas requisições (desde que credentials: 'include' esteja ativado no fetch)
    Exemplo:  fetch('/api/auth/refresh', { credentials: 'include' })

    Secure: o cookie só é enviado em conexões HTTPS, aumentando a segurança em produção.
    Exemplo:  Em produção, cookies só serão enviados se o site estiver rodando em https://

    SameSite: 'Strict' impede que o cookie seja enviado em requisições cross-site, protegendo contra CSRF.
    Exemplo:  Se um formulário de outro domínio tentar enviar uma requisição, o cookie não será incluído.

    Path: define o caminho em que o cookie é válido. Aqui, apenas para '/api/auth/refresh'.
    Exemplo:  O cookie só será enviado em requisições para /api/auth/refresh

    maxAge: define o tempo de vida do cookie em segundos.
    Exemplo:  Se maxAge for 3600, o cookie expira em 1 hora após ser definido.
*/