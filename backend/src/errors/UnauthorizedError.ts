import { BaseError, type ValidationIssue } from './BaseError.ts';

export class UnauthorizedError extends BaseError {
  constructor(message = "Não autorizado", issues?: ValidationIssue[]) {
    super(message, 401, issues);
  }
}
