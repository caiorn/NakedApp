export function success(reply, statusCode, { data = null, message = null, meta = {} }) {
  const response = {
    success: true,
    status: statusCode || 200, //futuro dashboard, logs...
    message: message || undefined,
    data: data ?? undefined
  };

  for (const _ in meta) {
    response.meta = meta;
    break;
  }

  response.path = reply.request.raw.url;
  response.timestamp = new Date().toISOString();
  reply.code(statusCode || 200).send(response);
}

export function fail(reply, statusCode, { message, error, issues, origin}) {
  const response = {
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