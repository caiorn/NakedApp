import { AppError } from '../errors/AppError.js'
import { ZodError } from 'zod'
import { env } from '../env.js'
import { ValidationError } from '../errors/ValidationError.js'

export function errorHandler(error, request, reply) {
    try {
        const errorResponse = {
            success : false,
            status: error.statusCode || 500,
            error: error.constructor.name,
            message: error.message || 'Internal Server Error',
            path: request.url,
            timestamp: new Date().toISOString(),
        }

        if (error instanceof ValidationError && error.issues) {
            errorResponse.issues = error.issues
        }

        //se for um erro nao identificado/bug
        if (error.constructor === Error) {
            console.error(error.stack);    
        }

        //se não tiver em producao, incluir o origin na resposta
        if (env.NODE_ENV !== 'production' && error.stack) {            
            const stackLines = error.stack.split('\n');
            // Pega a primeira linha que esteja fora de node_modules e internal, e dentro do seu src
            const origin = stackLines.find(line =>
                line.includes('at ') &&
                !line.includes('node_modules') &&
                !line.includes('internal') &&
                line.includes('/src/') // se seu código estiver dentro da pasta /src/
            );

            if (origin) {
                errorResponse.origin = origin.trim();
            }
        } else {
            // TODO: logar erro em serviço externo (Sentry, etc)
        }

        reply.status(errorResponse.status).send(errorResponse);
    } catch (error) {
        console.error('------------- error in error-handler.js------------')
        console.error(error.stack);
        reply.status(500).send("error-handler error");

    }
}