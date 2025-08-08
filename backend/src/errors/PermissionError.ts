import { BaseError, type ValidationIssue } from './BaseError.ts';

/**
 *  quando o usuário está autenticado, 
 *  mas não tem permissão para acessar o recurso
 */

export class PermissionError extends BaseError {
  constructor(message = "Acesso negado", issues?: ValidationIssue[]) {
    super(message, 403, issues);
  }
}