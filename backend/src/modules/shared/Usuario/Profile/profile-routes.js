//import * as profileController from './profile-controller.js';
import { verifyJWT } from '../../../../middlewares/verify-jwt.js';
import { makeUserService } from "../user-service-factory.js";


export const profileRoutes = async (fastify, options) => {
    fastify.get('/me',{ onRequest: verifyJWT }, async (request, reply) => {
        const { sub : id} = request.user; // Assuming the user ID is in the JWT payload

        const userService = makeUserService();
        const user = await userService.getUserById(id);
        if (!user) {
            return reply.code(404).send("User not found");
        }

        reply.code(200).send(user);
    });
}