/**
 *  quando o usuário está autenticado, 
 *  mas não tem permissão para acessar o recurso
 */

export class PermissionError extends Error {
  constructor(message = "Acesso negado", issues) {
    super(message);
    this.name = "PermissionError";
    this.statusCode = 403;
    this.issues = issues && (Array.isArray(issues) ? issues : [issues]);
    Error.captureStackTrace?.(this, this.constructor);
  }
}