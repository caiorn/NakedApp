export class NotFoundError extends Error {
  constructor(message = "Recurso não encontrado", issues) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
    this.issues = issues && (Array.isArray(issues) ? issues : [issues]);
    Error.captureStackTrace?.(this, this.constructor);
  }
}