export const CONFIG = {
	ADDRESS: process.env.ADDRESS ?? "0.0.0.0",
	PORT: parseInt(process.env.PORT ?? "8080"),
	DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING ?? "",
	DB_HOST: process.env.DB_HOST ?? "127.0.0.1",
	DB_PORT: parseInt(process.env.DB_PORT ?? "3306"),
	DB_USER: process.env.DB_USER ?? "",
	DB_PASSWORD: process.env.DB_PASSWORD ?? "",
	DB_NAME: "magus",
}
