export function responseDecorator(fastify, options, done) {
  fastify.decorateReply('success', function({
    data = null,
    message = 'Operação realizada com sucesso',
    status = 200,
    meta = {}
  } = {}) {
    return this.code(status).send({
      success: true,
      status,
      message,
      data,
      path: this.request.url,
      timestamp: new Date().toISOString(),
      meta
    });
  });

  done();
}