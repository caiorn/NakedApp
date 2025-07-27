export { AppError } from './AppError.js';
export { ConflictError } from './ConflictError.js';
export { DatabaseError } from './DatabaseError.js';
export { NotFoundError } from './NotFoundError.js';
export { RateLimitError } from './RateLimitError.js';
export { AuthError } from './AuthError.js';
export { UnauthorizedError } from './UnauthorizedError.js';
export { BadRequestError } from './BadRequestError.js';
export { TokenExpiredError } from './TokenExpiredError.js';
export { ServiceUnavailableError } from './ServiceUnavailableError.js';
export { PermissionError } from './PermissionError.js';

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