import type { FastifyReply, FastifyRequest } from 'fastify';
import { env } from '../env.ts'
import { BaseError } from '../errors/BaseError.ts';

function extractOrigin(stack?: string): string | undefined {
    if (!stack || env.NODE_ENV === "production") return;

    return stack
        .split("\n")
        .find(
            (line) =>
                line.includes("at ") &&
                !line.includes("node_modules") &&
                !line.includes("internal") &&
                line.includes("/src/")
        )
        ?.trim();
}

export function errorHandler(error: unknown, _req: FastifyRequest, reply: FastifyReply) {
    try {
        let statusCode = 500;
        let message = "Erro interno inesperado";
        let errorName = "InternalServerError";
        let issues;
        let origin;

        if (error instanceof BaseError) {
            statusCode = error.statusCode;
            message = error.message;
            errorName = error.name;
            issues = error.issues;
        } else if (error instanceof Error) {
            console.error(error.stack || error.message);
            origin = extractOrigin(error.stack);
        } else {
            console.error("Non-Error thrown:", error);
        }
        reply.fail(statusCode, { message, error: errorName, issues, origin });
    } catch (handlerError) {
        console.error("------------- error in error-handler ------------");
        console.error(handlerError);
        reply.status(500).send("error-handler error");
    }
}