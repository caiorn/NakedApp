export class RateLimitError extends Error {
  constructor(message = "Limite de requisições excedido", issues) {
    super(message);
    this.name = "RateLimitError";
    this.statusCode = 429;
    this.issues = issues && (Array.isArray(issues) ? issues : [issues]);
    Error.captureStackTrace?.(this, this.constructor);
  }
}