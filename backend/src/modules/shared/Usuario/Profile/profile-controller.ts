import type { FastifyRequest, FastifyReply } from "fastify";

export async function getUserProfile(request: FastifyRequest, reply: FastifyReply) {

    const { sub : id} = request.userLogged?.payload; // Assuming the user ID is in the JWT payload
    console.log(request.userLogged);
    // const { id } = request.params;
    // const userService = makeUserService();
    // const user = await userService.getUserById(id);
    // if (!user) {
    //     return reply.code(404).send("User not found");
    // }
    reply.code(200).send(id);
}