import {FastifyReply, FastifyRequest} from 'fastify'

export async function checkSessionIsExists(request, reply) {
	const sessionId = request.cookies.sessionId

	if (!sessionId) {
		return reply.status(401).send({
			error: 'Unauthorized.'
		})
	}
}
