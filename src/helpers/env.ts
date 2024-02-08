import { z } from "zod"

const envSchema = z.object({
	SERVER_ADDRESS: z.string().default("0.0.0.0"),
	SERVER_PORT: z.string().default("8080"),
	COOKIE_SIGN_SECRET: z.string(),
	JWT_SIGN_SECRET: z.string(),
	NODE_ENV: z.enum(["development", "production"]).default("development"),
})

export const ENV = envSchema.parse(process.env)
