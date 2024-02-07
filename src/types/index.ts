import { onRequestHookHandler } from "fastify"
import { Sequelize } from "sequelize"

declare module "fastify" {
	interface FastifyInstance {
		authenticate: onRequestHookHandler
		db: Sequelize
	}
}
