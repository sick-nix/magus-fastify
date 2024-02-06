import { FastifyInstance } from "fastify"

export async function registerAuthRoutes(fastify: FastifyInstance) {
	fastify.get("/me", { onRequest: [fastify.authenticate] }, function (request) {
		// todo check that request.user doesn't include password, even if hashed
		return request.user
	})
}
