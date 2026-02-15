import type { RouterMiddlewareData } from "@/modules/Router/types/RouterMiddlewareData";
import { Route } from "@/modules/Route/Route";
import type { RouteId } from "@/modules/Route/types/RouteId";
import type { MiddlewareOptions } from "@/modules/Middleware/types/MiddlewareOptions";
import { ControllerAbstract } from "@/modules/Controller/ControllerAbstract";

export class RouterMiddlewareRegistry {
	readonly middlewares: Record<RouteId | "*", RouterMiddlewareData[]> = {
		"*": [],
	};

	addMiddleware(opts: MiddlewareOptions) {
		// "*" adds +1 to index but doesn't matter since global middlewares run first
		const order = Object.keys(this.middlewares).length + 1;
		const handler = opts.handler;
		const useOn = opts.useOn;

		if (useOn === "*") {
			this.middlewares["*"].push({ order, handler });
			return;
		}

		const targets = Array.isArray(useOn) ? useOn : [useOn];

		for (const target of targets) {
			const routeIds =
				target instanceof Route
					? [target.id]
					: target instanceof ControllerAbstract
						? Array.from(target.routeIds)
						: [];

			for (const routeId of routeIds) {
				if (!this.middlewares[routeId]) {
					this.middlewares[routeId] = [];
				}
				this.middlewares[routeId].push({ order, handler });
			}
		}
	}

	findMiddleware(routeId: RouteId) {
		const globalMiddlewares = (this.middlewares["*"] || []).sort(
			(a, b) => a.order - b.order,
		);
		const routeMiddlewares = (this.middlewares[routeId] || []).sort(
			(a, b) => a.order - b.order,
		);
		return [...globalMiddlewares, ...routeMiddlewares];
	}
}
