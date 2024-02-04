import fastify from "fastify"

const { ADDRESS = "localhost", PORT = 8080 } =
	process.env as NodeJS.ProcessEnv & {
		ADDRESS: string
		PORT: number
	}

const server = fastify()

server.get("/ping", async (request, reply) => {
	return "pongify\n"
})

server.listen({ host: ADDRESS, port: PORT }, (err, address) => {
	if (err) {
		console.error(err)
		process.exit(1)
	}
	console.log(`Server listening at ${address}`)
})
