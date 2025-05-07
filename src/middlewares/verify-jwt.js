import { AppError } from "../errors/AppError.js"


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
        throw new AppError("No Authorization", 401)
    }
}