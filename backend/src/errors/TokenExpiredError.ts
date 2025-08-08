import { BaseError, type ValidationIssue } from './BaseError.ts';

export class TokenExpiredError extends BaseError {
  constructor(message = "Token expirado", issues?: ValidationIssue[]) {
    super(message, 401, issues);
  }
}