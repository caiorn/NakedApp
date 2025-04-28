

export async function verifyJWT(request, reply) {
    // const token = request.cookies.sessionId

    // if (!token) {
    //     return reply.status(401).send({
    //         error: 'Unauthorized.'
    //     })
    // }

    try {
        await request.jwtVerify()
    } catch (err) {
        return reply.code(401).send({
            error: 'Unauthorized.',
            message: err.message,
        });
    }
}