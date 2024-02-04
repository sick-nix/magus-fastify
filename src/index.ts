import Fastify from "fastify"
import { registerPlugins } from "./plugins"
import { CONFIG } from "./helpers/env"
import { registerRoutes } from "./routes"
import { db } from "./db"

const fastify = Fastify()
registerPlugins(fastify)
registerRoutes(fastify)

fastify.listen({ host: CONFIG.ADDRESS, port: CONFIG.PORT }, (err, address) => {
	if (err) {
		console.error(err)
		process.exit(1)
	}

	db.authenticate().catch((dbError) => {
		throw "Unable to connect to the database:" + dbError
	})

	console.log(`Server listening at ${address}`)
})
