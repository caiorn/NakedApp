// Define ValidationIssue type locally
export type ValidationIssue = {
	field: string;
	message: string;
};

export class BaseError extends Error {
  statusCode: number;
  issues: ValidationIssue[] | undefined;

  constructor(
    message: string,
    statusCode = 400,
    issues?: ValidationIssue | ValidationIssue[]
  ) {
    super(message);
    this.statusCode = statusCode;
    this.issues = issues && (Array.isArray(issues) ? issues : [issues]);
    this.name = this.constructor.name;
    Error.captureStackTrace?.(this, this.constructor);
  }
}