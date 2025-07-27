export class AuthError extends Error {
  constructor(message = "Erro de autenticação", issues) {
    super(message);
    this.name = "AuthError";
    this.statusCode = 401;
    this.issues = issues && (Array.isArray(issues) ? issues : [issues]);
    Error.captureStackTrace?.(this, this.constructor);
  }
}