import bcrypt from "bcrypt"
import { z } from "zod"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { User } from "../models/user"
import { FastifyRegisterFunction } from "../types/routes"

const registerSchema = z.object({
	email: z.string().email(),
	emailConfirm: z.string().email(),
	password: z
		.string()
		.regex(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/),
	passwordConfirm: z.string(),
	username: z.string(),
})

async function hashPassword(password: string) {
	return await bcrypt.hash(password, 10)
}

export const registerAuthRoutes: FastifyRegisterFunction = (
	fastify,
	_,
	done
) => {
	// fastify
	// 	.withTypeProvider<ZodTypeProvider>()
	// 	.get("/", async function (request) {
	// 		return { hello: "world" }
	// 	})
	fastify.withTypeProvider<ZodTypeProvider>().post(
		"/register",
		{
			schema: {
				body: registerSchema,
			},
		},
		async function (request, reply) {
			// todo test to see if it works
			console.log(fastify, request.body)
			reply.send(request.body)

			const { email, emailConfirm, password, passwordConfirm, username } =
				request.body
			if (
				!(
					email &&
					email === emailConfirm &&
					password &&
					password === passwordConfirm &&
					username
				)
			)
				reply.status(401).send({ error: "Invalid registration fields" })

			try {
				const hashedPassword = await hashPassword(password)
				await User.create({
					email,
					password: hashedPassword,
					username,
				})
				reply.status(201).send({ success: "Registration successful" })
			} catch (err) {
				reply.status(400).send({ error: "There was a problem saving user" })
			}
		}
	)

	fastify.get("/me", { onRequest: [fastify.authenticate] }, function (request) {
		// todo check that request.user doesn't include password, even if hashed
		return request.user
	})

	done()
}
