import { env } from '../env.js'
import { fail } from '../utils/api-response.js'
import { BadRequestError } from '../errors/BadRequestError.js';
import { AppError } from '../errors/AppError.js';

export function errorHandler(error, request, reply) {
    try {
        //se não tiver em producao, incluir o origin na resposta
        if (!(error instanceof BadRequestError || error instanceof AppError) && error.stack) {
            console.error(error.stack);
        }
        let origin;
        if (env.NODE_ENV !== 'production' && error.stack) {
            const stackLines = error.stack.split('\n');
            // Pega a primeira linha que esteja fora de node_modules e internal, e dentro do seu src
            origin = stackLines.find(line =>
                line.includes('at ') &&
                !line.includes('node_modules') &&
                !line.includes('internal') &&
                line.includes('/src/') // se seu código estiver dentro da pasta /src/
            );

            if (origin) {
                origin = origin.trim();
            }
        } else {
            // TODO: logar erro em serviço externo (Sentry, etc)
        }

        fail(reply, error.statusCode, {
            message: error.message,
            error: error.constructor.name,
            issues: error.issues,
            origin
        });
    } catch (error) {
        console.error('------------- error in error-handler.js------------')
        console.error(error.stack);
        reply.status(500).send("error-handler error");
    }
}