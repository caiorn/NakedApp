//import * as profileController from './profile-controller.ts';
import type { FastifyRequest, FastifyReply, FastifyInstance, FastifyPluginOptions } from "fastify";
import { authUserHandler } from '../../../../middlewares/auth-user-handler.ts';
import { makeUserService } from "../user-service-factory.ts";


export const profileRoutes = async (fastify : FastifyInstance, _options : FastifyPluginOptions) => {
    fastify.get('/me',{ onRequest: authUserHandler }, async (request: FastifyRequest, reply: FastifyReply) => {
        const { sub : id} = request.userLogged?.payload; // Assuming the user ID is in the JWT payload

        const userService = makeUserService();
        const user = await userService.findUserById(id);
        if (!user) {
            return reply.code(404).send("User not found");
        }

        reply.code(200).send(user);
    });
}