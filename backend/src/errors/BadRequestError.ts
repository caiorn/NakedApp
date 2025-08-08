import type { ZodError } from 'zod';
import { BaseError, type ValidationIssue } from './BaseError.ts'

export class BadRequestError extends BaseError {
	constructor(statusCode = 400, message: string, source?: any) {
		super(message, statusCode);
		this.issues = this.parseIssues(source);
	}

	private parseIssues(source?: any): ValidationIssue[] | undefined {
		if (!source) return undefined;

		// Se é resultado do safeParse com erro
		if (this.isZodSafeParseError(source)) {
			return source.error.issues.map(issue => ({
				field: issue.path.join('.') || 'root',
				message: issue.message,
			}));
		}

		// Se é um ZodError direto
		if (this.isZodError(source)) {
			return source.issues.map(issue => ({
				field: issue.path.join('.') || 'root',
				message: issue.message,
			}));
		}
		// Se é array ou objeto manual
		return Array.isArray(source) ? source : [source];
	}

	private isZodSafeParseError(obj: any): obj is { success: false; error: ZodError } {
		return obj?.success === false && obj?.error?.issues;
	}

	private isZodError(obj: any): obj is ZodError {
		return obj?.issues && Array.isArray(obj.issues);
	}
}

/*
	// Com safeParse
	if (!validatedUser.success) {
	throw new BadRequestError("Dados inválidos", validatedUser);
	}

	// Com array manual
	throw new BadRequestError("Dados inválidos", [
	{ field: 'email', message: 'Email inválido' }
	]);

	// Sem issues
	throw new BadRequestError("Requisição inválida");
*/

