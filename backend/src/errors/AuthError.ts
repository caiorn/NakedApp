import { BaseError, type ValidationIssue } from './BaseError.ts'

export class AuthError extends BaseError {
  constructor(message = "Erro de autenticação", issues?: ValidationIssue[]) {
    super(message, 401, issues);
  }
}