import { BaseError, type ValidationIssue } from './BaseError.ts';

export class RateLimitError extends BaseError {
  constructor(message = "Limite de requisições excedido", issues?: ValidationIssue[]) {
    super(message, 429, issues);
  }
}