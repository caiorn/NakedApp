

export async function getUserProfile(request, reply) {

    const { sub : id} = request.user; // Assuming the user ID is in the JWT payload
    console.log(request.user);
    // const { id } = request.params;
    // const userService = makeUserService();
    // const user = await userService.getUserById(id);
    // if (!user) {
    //     return reply.code(404).send("User not found");
    // }
    reply.code(200).send(id);
}