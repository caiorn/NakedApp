import { BaseError, type ValidationIssue } from './BaseError.ts';

export class NotFoundError extends BaseError {
  constructor(message = "Recurso não encontrado", issues?: ValidationIssue[]) {
    super(message, 404, issues);
  }
}