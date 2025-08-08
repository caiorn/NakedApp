export { AppError } from './AppError.ts';
export { ConflictError } from './ConflictError.ts';
export { DatabaseError } from './DatabaseError.ts';
export { NotFoundError } from './NotFoundError.ts';
export { RateLimitError } from './RateLimitError.ts';
export { AuthError } from './AuthError.ts';
export { UnauthorizedError } from './UnauthorizedError.ts';
export { BadRequestError } from './BadRequestError.ts';
export { TokenExpiredError } from './TokenExpiredError.ts';
export { ServiceUnavailableError } from './ServiceUnavailableError.ts';
export { PermissionError } from './PermissionError.ts';

/*
AuthError: para erros de autenticação (login inválido, usuário não encontrado, senha incorreta).
PermissionError: para erros de autorização (acesso negado, sem permissão).
NotFoundError: para recursos não encontrados (usuário, rota, arquivo).
ConflictError: para conflitos de dados (duplicidade, registro já existe).
RateLimitError: para controle de limite de requisições.
DatabaseError: para erros de banco de dados (falha de conexão, query inválida).
ServiceUnavailableError: para dependências externas indisponíveis (API, serviço de terceiros).
BadRequestError: para requisições malformadas ou parâmetros inválidos.

*/