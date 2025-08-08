import { BaseError, type ValidationIssue } from './BaseError.ts';

export class ServiceUnavailableError extends BaseError {
  constructor(message = "Serviço indisponível", issues?: ValidationIssue[]) {
    super(message, 503, issues);
  }
} 