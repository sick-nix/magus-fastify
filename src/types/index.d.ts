import * as fastify from "fastify"
import { Sequelize } from "sequelize"

declare module "fastify" {
	interface FastifyInstance extends fastify.FastifyInstance {
		authenticate: function
		db: Sequelize
	}
}
