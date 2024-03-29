import { FastifyReply, FastifyRequest } from "fastify"
import cors from "@fastify/cors"
import cookiePlugin from "@fastify/cookie"
import jwtPlugin from "@fastify/jwt"
import staticPlugin from "@fastify/static"
import printRoutesPlugin from "./print-routes"
import errorHandlerPlugin from "./error-handler"
import path from "path"
import { ENV } from "../helpers/env"
import { db } from "../models"
import fp from "fastify-plugin"

export const registerPlugins = fp((fastify, _, done) => {
	if (ENV.NODE_ENV == "development") fastify.register(printRoutesPlugin)

	fastify.register(errorHandlerPlugin)
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
		cookie: {
			cookieName: "magus",
			signed: true,
		},
	})

	fastify.decorate(
		"authenticate",
		async function (request: FastifyRequest, reply: FastifyReply) {
			try {
				await request.jwtVerify({ onlyCookie: true })
			} catch (err) {
				reply.send(err)
			}
			return
		}
	)

	fastify.decorate("db", db)
	done()
})
