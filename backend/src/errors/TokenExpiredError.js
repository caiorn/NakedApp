import { BaseError } from './BaseError.js'

export class TokenExpiredError extends BaseError {
  constructor(message = "Token expirado") {
    super(message, 401, null);
  }
}