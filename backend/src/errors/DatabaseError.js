export class DatabaseError extends Error {
  constructor(message = "Erro de banco de dados", issues) {
    super(message);
    this.name = "DatabaseError";
    this.statusCode = 500;
    this.issues = issues && (Array.isArray(issues) ? issues : [issues]);
    Error.captureStackTrace?.(this, this.constructor);
  }
}