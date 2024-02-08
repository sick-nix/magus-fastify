import { registerAuthRoutes } from "./auth"
import { FastifyRegisterFunction } from "../types/routes"

export const registerRoutes: FastifyRegisterFunction = (fastify, _, done) => {
	fastify.get("/", function (request, response) {
		response.sendFile("index.html")
	})

	fastify.register(
		function (app, _, next) {
			app.register(registerAuthRoutes, { prefix: "auth" })
			next()
		},
		{ prefix: "api/v1" }
	)
	done()
}
