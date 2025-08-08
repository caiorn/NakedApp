//import * as profileController from './profile-controller.ts';
import { authUserHandler } from '../../../../middlewares/auth-user-handler.ts';
import { makeUserService } from "../user-service-factory.ts";


export const profileRoutes = async (fastify, options) => {
    fastify.get('/me',{ onRequest: authUserHandler }, async (request, reply) => {
        const { sub : id} = request.user; // Assuming the user ID is in the JWT payload

        const userService = makeUserService();
        const user = await userService.findUserById(id);
        if (!user) {
            return reply.code(404).send("User not found");
        }

        reply.code(200).send(user);
    });
}