import { Sequelize } from "sequelize"
import { CONFIG } from "../helpers/env"

export const db = new Sequelize({
	dialect: "postgres",
	host: CONFIG.DB_HOST,
	port: CONFIG.DB_PORT,
	username: CONFIG.DB_USER,
	password: CONFIG.DB_PASSWORD,
	database: CONFIG.DB_NAME,
})
