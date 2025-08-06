import { BaseError } from './BaseError.js';

export class RateLimitError extends BaseError {
  constructor(message = "Limite de requisições excedido", issues) {
    super(message, 429, issues);
  }
}