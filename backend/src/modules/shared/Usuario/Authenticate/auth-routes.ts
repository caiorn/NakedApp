import { authenticateUser, getInfoToken, refreshToken } from "./auth-controller.ts";
import { authUserHandler } from '../../../../middlewares/auth-user-handler.ts';

export const authRoutes = async (fastify) => {
  fastify.post('/login', authenticateUser);
  fastify.post('/logout', { preHandler: authUserHandler }, getInfoToken);
  fastify.post('/refresh', refreshToken);
  fastify.post('/forgot-password', { preHandler: authUserHandler }, getInfoToken);
  fastify.get('/token-info', { preHandler: authUserHandler }, getInfoToken);
  fastify.post('/register', async (request, reply) => {
    const { name, email, password } = request.body;
    // Logic to register user
    // If successful, return user data or confirmation message
    return { message: 'User registered successfully' };
  });
}