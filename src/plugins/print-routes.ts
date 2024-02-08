import {
	type FastifyError,
	type FastifyInstance,
	type FastifyPluginOptions,
	type RouteOptions,
} from "fastify"
import fastifyPlugin from "fastify-plugin"

type RouteConfig = Record<string, any>

type RouteFilter = (route: RouteOptions) => boolean

interface Schema {
	properties: Record<string, unknown>
	required: string[]
}

const methodsOrder = [
	"GET",
	"POST",
	"PUT",
	"DELETE",
	"HEAD",
	"PATCH",
	"OPTIONS",
]

function getRouteConfig(r: RouteOptions): RouteConfig {
	return (r.config as RouteConfig) ?? {}
}

function sortRoutes(a: RouteOptions, b: RouteOptions): number {
	return a.url.localeCompare(b.url)
}

function unifyRoutes(routes: RouteOptions[]): RouteOptions[] {
	const routesMap = new Map<string, RouteOptions>()

	for (const route of routes) {
		const unifiedRoute = routesMap.get(route.url)

		if (unifiedRoute) {
			if (typeof unifiedRoute.method === "string") {
				unifiedRoute.method = [unifiedRoute.method]
			}

			// Unify the routes
			if (typeof route.method === "string") {
				unifiedRoute.method.push(route.method)
			} else {
				unifiedRoute.method.push(...route.method)
			}

			// Remove the description when they don't match
			const config = unifiedRoute?.config as RouteConfig | undefined

			if (
				config &&
				config?.description !== (route.config as RouteConfig)?.description
			) {
				config.description = undefined
			}
		} else {
			routesMap.set(route.url, route)
		}
	}

	return [...routesMap.values()].sort(sortRoutes)
}

function printRoutes(
	routes: RouteOptions[],
	compact: boolean,
	filter: RouteFilter
): void {
	if (routes.length === 0) {
		return
	}
	// Sort and eventually unify routes
	routes = routes
		.filter((r) => getRouteConfig(r).hide !== true && filter(r))
		.sort(sortRoutes)

	if (compact) {
		routes = unifyRoutes(routes)
	}

	const hasDescription = routes.some((r) => "description" in getRouteConfig(r))

	// Build the output
	const headers = ["Method", "Path"]

	if (hasDescription) {
		headers.push("Description")
	}

	const rows: string[] = [headers.join("\t\t")]

	for (const route of routes) {
		const methods = Array.isArray(route.method) ? route.method : [route.method]

		const url = route.url.replaceAll(/:\w+|\[:\w+]/g, "$& -")
		const querystring = []

		if (route.schema?.querystring) {
			// Get all properties
			const schema = route.schema.querystring as Schema
			const requiredProperties = schema.required ?? []

			for (const property of Object.keys(schema.properties) ?? {}) {
				const param = `${property}=value`
				const separator: string = querystring.length === 0 ? "?" : "&"

				if (requiredProperties.includes(property)) {
					querystring.push(separator + param)
				} else {
					querystring.push(`${separator}(${param})`)
				}
			}
		}

		const query = querystring
			.join("")
			.replaceAll("&(", "(&")
			.replaceAll(")&", "&)")
			.replaceAll(")(&", "&)(")
		const row = [
			methods
				.sort((a, b) => methodsOrder.indexOf(a) - methodsOrder.indexOf(b))
				.map((m) => `${m}`)
				.join(" | "),
			`${url}${query}`,
		]

		if (hasDescription) {
			row.push(`${getRouteConfig(route).description ?? ""}`)
		}

		rows.push(row.join("\t\t"))
	}

	console.log(`Available routes:\n\n${rows.join("\n")}`)
}

export const plugin = fastifyPlugin(
	function (
		instance: FastifyInstance,
		options: FastifyPluginOptions,
		done: (error?: FastifyError) => void
	): void {
		const compact: boolean = options.compact ?? false
		const filter: RouteFilter = options.filter ?? (() => true)

		const routes: RouteOptions[] = []

		// Utility to track all the RouteOptionss we add
		instance.addHook("onRoute", (route) => {
			routes.push(route)
		})

		instance.addHook("onReady", (done) => {
			printRoutes(routes, compact, filter)
			done()
		})

		done()
	},
	{ name: "fastify-print-routes" }
)

export default plugin
