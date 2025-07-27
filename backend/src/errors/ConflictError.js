export class ConflictError extends Error {
  constructor(message = "Conflito de dados", issues) {
    super(message);
    this.name = "ConflictError";
    this.statusCode = 409;
    this.issues = issues && (Array.isArray(issues) ? issues : [issues]);
    Error.captureStackTrace?.(this, this.constructor);
  }
}