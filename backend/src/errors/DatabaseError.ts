import { BaseError, type ValidationIssue } from './BaseError.ts';

export class DatabaseError extends BaseError {
  constructor(message = "Erro de banco de dados", issues?: ValidationIssue[]) {
    super(message, 500, issues);
  }
}