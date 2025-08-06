import { BaseError } from './BaseError.js'

export class AuthError extends BaseError {
  constructor(message = "Erro de autenticação", issues) {
    super(message, 401, issues);
  }
}