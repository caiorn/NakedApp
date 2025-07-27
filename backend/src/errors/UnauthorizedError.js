    /**
     *  quando o usuário não está autenticado
     */
    export class UnauthorizedError extends Error {
      constructor(message = "Não autorizado", issues) {
        super(message);
        this.name = "UnauthorizedError";
        this.statusCode = 401;
        this.issues = issues && (Array.isArray(issues) ? issues : [issues]);
        Error.captureStackTrace?.(this, this.constructor);
      }
    }
