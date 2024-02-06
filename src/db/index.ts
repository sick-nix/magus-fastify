import { Sequelize } from "sequelize"
import { ENV } from "../helpers/env"

export const db = new Sequelize({
	dialect: "postgres",
	host: ENV.DB_HOST,
	port: ENV.DB_PORT,
	username: ENV.DB_USER,
	password: ENV.DB_PASSWORD,
	database: ENV.DB_NAME,
})

db.authenticate().catch((dbError) => {
	throw "Unable to connect to the database:" + dbError
})
