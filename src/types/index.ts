import { PrismaClient } from "@prisma/client"
import { onRequestHookHandler } from "fastify"

declare module "fastify" {
	interface FastifyInstance {
		authenticate: onRequestHookHandler
		db: PrismaClient
	}
}
