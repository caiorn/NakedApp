import { BaseError, type ValidationIssue } from './BaseError.ts'
/*
	Ao chamar new AppError sempre passar o statusCode, evite deixar o padrão 422.
	código HTTP 422 indica que o servidor entende o tipo de conteúdo da solicitação 
	e a sintaxe está correta, mas não pode processar as instruções contidas nela, 
	por alguma regra de negócio violada.Adiciona default nesta classe para 
	diferenciar do status code 500 para somente ser usado erros desconhecidos.
*/

export class AppError extends BaseError {
	constructor(statusCode = 422, message = 'An error occurred', issues?: ValidationIssue[]) {
		super(message, statusCode, issues)
	}
}