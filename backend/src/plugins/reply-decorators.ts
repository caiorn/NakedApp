import type { FastifyReply } from "fastify"; 

export type SuccessReply = typeof success;
export type FailReply = typeof fail;

export function success(
    this: FastifyReply,
    statusCode: number,
    body : {
        data?: any;
        message?: string | null;
        meta?: object;
    }
) {
    const response = {
        success: true,
        status: statusCode || 200,
        message: body.message || undefined,
        data: body.data ?? undefined,
        meta: undefined as object | undefined,
        path: this.request.raw.url,
        timestamp: new Date().toISOString() 
    };

    for (const _ in body.meta) {
        response.meta = body.meta;
        break;
    }

    this.code(statusCode || 200).send(response);
}

export function fail(
    this: FastifyReply,
    statusCode: number,
    body: { 
        message?: string; 
        error?: string; 
        issues?: any; 
        origin?: string 
    }) {
    const response = {
        success: false,
        status: statusCode || 500,
        message: body.message || 'An error occurred',
        error: body.error || 'InternalServerError',
        issues: body.issues || undefined,
        origin: body.origin || undefined,
        path: this.request.raw.url,
        timestamp: new Date().toISOString()
    };

    this.code(statusCode || 500).send(response);
}