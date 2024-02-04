import { FastifyInstance } from "fastify"
import cors from "@fastify/cors"
import staticPlugin from "@fastify/static"
import path from "path"

export function registerPlugins(fastify: FastifyInstance) {
	fastify.register(cors)
	fastify.register(staticPlugin, {
		root: path.join(process.cwd(), "public"),
		prefix: "/public/",
	})
}
