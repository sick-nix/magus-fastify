import { z } from "zod"

const envSchema = z.object({
	SERVER_ADDRESS: z.string().default("0.0.0.0"),
	SERVER_PORT: z.string().default("8080"),
	DB_CONNECTION_STRING: z.string().optional(),
	DB_HOST: z.string().default("db"),
	DB_PORT: z.string().default("5432"),
	DB_NAME: z.string().default("magus"),
	DB_USER: z.string().default("magus"),
	DB_PASSWORD: z.string(),
	COOKIE_SIGN_SECRET: z.string(),
	JWT_SIGN_SECRET: z.string(),
	NODE_ENV: z.enum(["development", "production"]).default("development"),
})

export const ENV = envSchema.parse(process.env)
