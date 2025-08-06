import { BaseError } from './BaseError.js';

export class ConflictError extends BaseError {
  constructor(message = "Conflito de dados", issues) {
    super(message, 409, issues);
  }
}