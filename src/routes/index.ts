import { registerAuthRoutes } from "./auth"
import fp from "fastify-plugin"

export const registerRoutes = fp((fastify, _, done) => {
	fastify.get("/", function (request, response) {
		response.sendFile("index.html")
	})
	fastify.get("/ping", async (request, reply) => {
		return "pong\n"
	})

	fastify.register(registerAuthRoutes, { prefix: "auth" })
	done()
})
