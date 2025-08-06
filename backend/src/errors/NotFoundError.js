import { BaseError } from './BaseError.js';

export class NotFoundError extends BaseError {
  constructor(message = "Recurso não encontrado", issues) {
    super(message, 404, issues);
  }
}