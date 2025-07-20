import { AppError } from "../errors/AppError.js"

export async function verifyJWT(request, reply) {
    // const token = request.cookies.sessionId

    // if (!token) {
    //     return reply.status(401).send({
    //         error: 'Unauthorized.'
    //     })
    // }

    try {
        const decoded = await request.jwtVerify();

      
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            throw new AppError(401, "Invalid Token");
        }
        if (err.name === 'TokenExpiredError') {
            throw new AppError(401, "Token Expired");
        }
        throw new AppError(err.statusCode, "No Authorization");
    }
}