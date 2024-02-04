import { FastifyInstance } from "fastify"

export function registerRoutes(fastify: FastifyInstance) {
	fastify.get("/", function (request, response) {
		response.sendFile("index.html")
	})
	fastify.get("/ping", async (request, reply) => {
		return "pong\n"
	})
}
