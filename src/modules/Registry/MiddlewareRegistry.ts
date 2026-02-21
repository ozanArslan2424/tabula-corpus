import { ControllerAbstract } from "@/modules/Controller/ControllerAbstract";
import type { MiddlewareInterface } from "@/modules/Middleware/MiddlewareInterface";
import type { MiddlewareRegistryData } from "@/modules/Registry/types/MiddlewareRegistryData";
import { Route } from "@/modules/Route/Route";
import type { RouteId } from "@/modules/Route/types/RouteId";

export class MiddlewareRegistry {
	readonly data: Record<RouteId | "*", Array<MiddlewareRegistryData>> = {
		"*": [],
	};

	add(item: MiddlewareInterface): void {
		// "*" adds +1 to index but doesn't matter since global middlewares run first
		const order = Object.keys(this.data).length + 1;
		const handler = item.handler;
		const useOn = item.useOn;

		if (useOn === "*") {
			this.data["*"].push({ order, handler });
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
				if (!this.data[routeId]) {
					this.data[routeId] = [];
				}
				this.data[routeId].push({ order, handler });
			}
		}
	}

	find(routeId: RouteId): Array<MiddlewareRegistryData> {
		const globalMiddlewares = (this.data["*"] || []).sort(
			(a, b) => a.order - b.order,
		);
		const routeMiddlewares = (this.data[routeId] || []).sort(
			(a, b) => a.order - b.order,
		);
		return [...globalMiddlewares, ...routeMiddlewares];
	}
}
