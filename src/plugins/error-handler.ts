import fp from "fastify-plugin"
import { ZodError } from "zod"
import { fromZodError } from "zod-validation-error"
import { ENV } from "../helpers/env"

export default fp(
	function (fastify, _, done) {
		fastify.setErrorHandler(function (error, request, reply) {
			if (error instanceof ZodError) {
				reply.status(400).send({
					statusCode: 400,
					error: "Bad Request",
					message: "Validation error",
					errors:
						ENV.NODE_ENV == "development"
							? fromZodError(error).toString()
							: undefined,
				})
				return
			}

			// fastify will use parent error handler to handle this
			reply.send(error)
		})

		done()
	},
	{
		name: "fastify-error-handler",
	}
)
