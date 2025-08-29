import type { FastifyInstance } from "fastify"; 
import * as c from "./auth-controller.ts";
import { authUserHandler } from '../../../../middlewares/auth-user-handler.ts';

export const authRoutes = async (fastify: FastifyInstance) => {
  fastify.post('/login', c.authenticateUser);
  fastify.post('/logout', { preHandler: authUserHandler }, c.getInfoToken);
  fastify.post('/refresh', c.refreshToken);
  fastify.post('/forgot-password', c.sendResetTokenToEmail);
  fastify.post('/reset-password', c.updatePasswordWithToken);
  fastify.get('/token-info', { preHandler: authUserHandler }, c.getInfoToken);
  // fastify.post('/register', async (request, reply) => {
  //   const { name, email, password } = request.body;
  //   // Logic to register user
  //   // If successful, return user data or confirmation message
  //   return { message: 'User registered successfully' };
  // });
}