import { authenticateUser } from "./auth-controller.js";

export const authRoutes = async (fastify) => {
  fastify.post('/login', authenticateUser);

  fastify.post('/register', async (request, reply) => {
    const { name, email, password } = request.body;
    // Logic to register user
    // If successful, return user data or confirmation message
    return { message: 'User registered successfully' };
  });
}