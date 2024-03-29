import Fastify from "fastify"
import "./types"
import { registerPlugins } from "./plugins"
import { registerRoutes } from "./routes"
import { ENV } from "./helpers/env"
import {
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod"

const fastify = Fastify()

fastify.setValidatorCompiler(validatorCompiler)
fastify.setSerializerCompiler(serializerCompiler)

fastify.register(registerPlugins)
fastify.register(registerRoutes)

fastify.listen(
	{ host: ENV.SERVER_ADDRESS, port: parseInt(ENV.SERVER_PORT) },
	(err, address) => {
		if (err) {
			fastify?.db?.$disconnect()
			console.error(err)
			process.exit(1)
		}

		console.log(`Server listening at ${address}`)
	}
)
