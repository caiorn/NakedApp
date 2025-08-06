import { BaseError } from './BaseError.js';

export class ServiceUnavailableError extends BaseError {
  constructor(message = "Serviço indisponível", issues) {
    super(message, 503, issues);
  }
} 