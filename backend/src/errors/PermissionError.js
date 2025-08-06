import { BaseError } from './BaseError.js';

/**
 *  quando o usuário está autenticado, 
 *  mas não tem permissão para acessar o recurso
 */

export class PermissionError extends BaseError {
  constructor(message = "Acesso negado", issues) {
    super(message, 403, issues);
  }
}