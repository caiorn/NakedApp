import type { FastifyReply } from 'fastify';
interface SuccessOptions {
  data?: any;
  message?: string;
  meta?: Record<string, any>;
}

export function success(reply: FastifyReply, statusCode: number, { data = null, message, meta = {} }: SuccessOptions) {
  const response: Record<string, any> = {
    success: true,
    status: statusCode || 200, //futuro dashboard, logs...
    message: message || undefined,
    data: data ?? undefined,
  };

  for (const _ in meta) {
    response.meta = meta;
    break;
  }

  response.path = reply.request.raw.url;
  response.timestamp = new Date().toISOString();
  reply.code(statusCode || 200).send(response);
}

interface FailOptions {
  message?: string;
  error?: string;
  issues?: any;
  origin?: string;
}

export function fail(reply: FastifyReply, statusCode: number, { message, error, issues, origin }: FailOptions) {
  const response: Record<string, any> = {
    success: false,
    status: statusCode || 500,
    message: message || 'An error occurred',
    error: error || 'InternalServerError',
    issues: issues || undefined,
    origin: origin || undefined
  };

  response.path = reply.request.raw.url;
  response.timestamp = new Date().toISOString();

  reply.code(statusCode || 500).send(response);
}