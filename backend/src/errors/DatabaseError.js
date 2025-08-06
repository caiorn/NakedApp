import { BaseError } from './BaseError.js';

export class DatabaseError extends BaseError {
  constructor(message = "Erro de banco de dados", issues) {
    super(message, 500, issues);
  }
}