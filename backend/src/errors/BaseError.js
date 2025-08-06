export class BaseError extends Error {
  constructor(message, statusCode = 400, issues) {
    super(message);
    this.statusCode = statusCode;
    this.issues = issues && (Array.isArray(issues) ? issues : [issues]);
    this.name = this.constructor.name;
    Error.captureStackTrace?.(this, this.constructor);
  }
}