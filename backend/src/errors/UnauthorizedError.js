import { BaseError } from './BaseError.js';

export class UnauthorizedError extends BaseError {
  constructor(message = "Não autorizado", issues) {
    super(message, 401, issues);
  }
}
