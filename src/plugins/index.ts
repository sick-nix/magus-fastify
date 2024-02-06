import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import cors from "@fastify/cors"
import cookiePlugin from "@fastify/cookie"
import jwtPlugin from "@fastify/jwt"
import staticPlugin from "@fastify/static"
import path from "path"
import { ENV } from "../helpers/env"
import { db } from "../db"

export async function registerPlugins(fastify: FastifyInstance) {
	fastify.register(cors)
	fastify.register(staticPlugin, {
		root: path.join(process.cwd(), "public"),
		prefix: "/public/",
	})

	fastify.register(cookiePlugin, {
		secret: ENV.COOKIE_SIGN_SECRET, // for cookies signature
	})

	fastify.register(jwtPlugin, {
		secret: ENV.JWT_SIGN_SECRET,
	})

	fastify.decorate(
		"authenticate",
		async function (request: FastifyRequest, reply: FastifyReply) {
			try {
				await request.jwtVerify()
			} catch (err) {
				reply.send(err)
			}
			return
		}
	)

	fastify.decorate("db", db)
}
