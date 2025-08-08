import { BaseError, type ValidationIssue } from './BaseError.ts'

export class ConflictError extends BaseError {
  constructor(message = "Conflito de dados", issues?: ValidationIssue[]) {
    super(message, 409, issues);
  }
}