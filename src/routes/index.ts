import { FastifyInstance } from "fastify"
import { registerAuthRoutes } from "./auth"

export async function registerRoutes(fastify: FastifyInstance) {
	fastify.get("/", function (request, response) {
		response.sendFile("index.html")
	})
	fastify.get("/ping", async (request, reply) => {
		return "pong\n"
	})

	fastify.register(registerAuthRoutes, { prefix: "auth" })
}
