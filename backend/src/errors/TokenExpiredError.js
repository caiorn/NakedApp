export class TokenExpiredError extends Error {
  constructor(message = "Token expirado") {
    super(message);
    this.name = "TokenExpiredError";
    this.statusCode = 401;
  }
}