import 'fastify';
import type { UserLogged } from '../modules/shared/Usuario/user.entity.ts';
import type { Knex } from 'knex';
import type { SuccessReply, FailReply } from '../plugins/reply-decorators.ts';


declare module 'fastify' {
  interface FastifyRequest {
    userLogged?: UserLogged;
  }
  interface FastifyReply {
    success: SuccessReply;
    error: FailReply;
  }
  interface FastifyInstance {
    db: Knex;
  }
}