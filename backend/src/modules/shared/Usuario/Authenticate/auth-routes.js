import { authenticateUser, getInfoToken } from "./auth-controller.js";
import { verifyJWT } from '../../../../middlewares/verify-jwt.js';

export const authRoutes = async (fastify) => {
  fastify.post('/login', authenticateUser);
  fastify.get('/token-info', { preHandler: verifyJWT }, getInfoToken);
  fastify.post('/register', async (request, reply) => {
    const { name, email, password } = request.body;
    // Logic to register user
    // If successful, return user data or confirmation message
    return { message: 'User registered successfully' };
  });
}