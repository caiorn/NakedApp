export class ServiceUnavailableError extends Error {
  constructor(message = "Serviço indisponível", issues) {
    super(message);
    this.name = "ServiceUnavailableError";
    this.statusCode = 503;
    this.issues = issues && (Array.isArray(issues) ? issues : [issues]);
    Error.captureStackTrace?.(this, this.constructor);
  }
}