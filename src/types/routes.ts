import { FastifyError, FastifyInstance, FastifyPluginOptions } from "fastify"

export type FastifyRegisterFunction = (
	instance: FastifyInstance,
	options: FastifyPluginOptions,
	done: (error?: FastifyError) => void
) => void
