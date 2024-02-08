import bcrypt from "bcrypt"
import { z } from "zod"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { FastifyRegisterFunction } from "../types/routes"
import lodash from "lodash"

const sessionMaxAgeInSeconds = 60 * 60 * 24 * 7 // one week

const registerSchema = z.object({
	email: z.string().email(),
	emailConfirm: z.string().email(),
	password: z
		.string()
		.regex(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/),
	passwordConfirm: z.string(),
	username: z.string(),
})

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string(),
})

async function hashPassword(password: string) {
	return bcrypt.hash(password, 10)
}

export const registerAuthRoutes: FastifyRegisterFunction = (
	fastify,
	_,
	done
) => {
	fastify.withTypeProvider<ZodTypeProvider>().post(
		"/register",
		{
			schema: {
				body: registerSchema,
			},
		},
		async function (request, reply) {
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
				await fastify.db.user.create({
					data: {
						email,
						password: hashedPassword,
						username,
					},
				})
				reply.status(201).send({ success: "Registration successful" })
			} catch (err) {
				reply.status(400).send({ error: "There was a problem saving user" })
			}
		}
	)

	// login route
	fastify.withTypeProvider<ZodTypeProvider>().post(
		"/login",
		{
			schema: {
				body: loginSchema,
			},
		},
		async (request, reply) => {
			const { email, password } = request.body

			const user = await fastify.db.user.findFirst({
				where: {
					email,
				},
			})
			if (!user) {
				reply.status(403).send({ error: "Email or password incorrect" })
				return
			}
			if (!(await bcrypt.compare(password, user.password))) {
				reply.status(403).send({ error: "Email or password incorrect" })
				return
			}

			const accessToken = fastify.jwt.sign(
				{ id: user.id },
				{
					expiresIn: sessionMaxAgeInSeconds,
				}
			)

			reply.setCookie("magus", accessToken, {
				path: "/",
				signed: true,
				sameSite: true,
				httpOnly: true,
				maxAge: sessionMaxAgeInSeconds * 1000,
			})
			reply.status(200).send(lodash.omit(user, ["password"]))
		}
	)

	fastify.delete("/logout", (_, reply) => {
		reply.clearCookie("magus")
		reply.status(200).send()
	})

	fastify.get("/me", { onRequest: [fastify.authenticate] }, function (request) {
		// todo check that request.user doesn't include password, even if hashed
		return request.user
	})

	done()
}
