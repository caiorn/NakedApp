import { ZodError } from 'zod';

export class ValidationError extends Error {
	constructor(statusCode, message, source) {
		super(message);
		this.statusCode = statusCode;

		// Se vier de um safeParse (objeto com error), extrai de .error
		const zodError = source?.error instanceof ZodError ? source.error : null;

		if (zodError) {
			this.issues = zodError.issues.map(issue => ({
				field: issue.path.join('.'),
				message: issue.message,
			}));
		} else if (source) {
			this.issues = Array.isArray(source) ? source : [source]; // lista de issues manual
		} 

		Error.captureStackTrace?.(this, this.constructor);
	}
}

/*
✅ Exemplo com Zod (safeParse)
const validatedUser = userSchema.safeParse(request.body);
if (!validatedUser.success) {
	throw new ValidationError('Erro de validação', 400, validatedUser);
}

✅ Exemplo manual:
throw new ValidationError('Dados inválidos', 400, [
	{ campo: 'email', mensagem: 'Email inválido' },
    { campo: 'senha', mensagem: 'Senha deve ter no mínimo 6 caracteres' }
]);
*/

