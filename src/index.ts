import Fastify from "fastify"
import { registerRoutes } from "./routes"
import { registerPlugins } from "./plugins"
import { ENV } from "./helpers/env"

const fastify = Fastify()
fastify.register(registerPlugins)
fastify.register(registerRoutes, { prefix: "api/v1" })

fastify.listen(
	{ host: ENV.SERVER_ADDRESS, port: ENV.SERVER_PORT },
	(err, address) => {
		if (err) {
			console.error(err)
			process.exit(1)
		}

		console.log(`Server listening at ${address}`)
	}
)
