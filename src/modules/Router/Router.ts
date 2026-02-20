import { RouterRouteRegistry } from "@/modules/Router/registries/RouterRouteRegistry";
import { RouterMiddlewareRegistry } from "@/modules/Router/registries/RouterMiddlewareRegistry";
import { RouterModelRegistry } from "@/modules/Router/registries/RouterModelRegistry";
import type { AnyRoute } from "@/modules/Route/types/AnyRoute";
import type { HttpRequestInterface } from "@/modules/HttpRequest/HttpRequestInterface";
import type { RegisteredRouteData } from "@/modules/Router/types/RegisteredRouteData";
import type { MiddlewareOptions } from "@/modules/Middleware/types/MiddlewareOptions";
import type { RouterMiddlewareData } from "@/modules/Router/types/RouterMiddlewareData";
import type { RouteId } from "@/modules/Route/types/RouteId";
import type { AnyRouteModel } from "@/modules/Parser/types/AnyRouteModel";
import type { RouterInterface } from "@/modules/Router/RouterInterface";

export class Router implements RouterInterface {
	globalPrefix: string = "";

	setGlobalPrefix(value: string) {
		this.globalPrefix = value;
	}

	// TODO: Caching for  routes
	routeRegistryInstance: RouterRouteRegistry | undefined;
	get routeRegistry(): RouterRouteRegistry {
		if (!this.routeRegistryInstance) {
			this.routeRegistryInstance = new RouterRouteRegistry();
		}
		return this.routeRegistryInstance;
	}
	get routes(): Record<RouteId, RegisteredRouteData> {
		return this.routeRegistry.routes;
	}
	addRoute(r: AnyRoute): void {
		return this.routeRegistry.addRoute(r);
	}
	findRoute(req: HttpRequestInterface): RegisteredRouteData {
		return this.routeRegistry.findRoute(req);
	}

	middlewareRegistryInstance: RouterMiddlewareRegistry | undefined;
	get middlewareRegistry(): RouterMiddlewareRegistry {
		if (!this.middlewareRegistryInstance) {
			this.middlewareRegistryInstance = new RouterMiddlewareRegistry();
		}
		return this.middlewareRegistryInstance;
	}
	get middlewares(): Record<RouteId, RouterMiddlewareData[]> {
		return this.middlewareRegistry.middlewares;
	}
	addMiddleware(opts: MiddlewareOptions): void {
		return this.middlewareRegistry.addMiddleware(opts);
	}
	findMiddleware(routeId: RouteId): Array<RouterMiddlewareData> {
		if (!this.middlewareRegistryInstance) {
			return [];
		}
		return this.middlewareRegistry.findMiddleware(routeId);
	}

	modelRegistryInstance: RouterModelRegistry | undefined;
	get modelRegistry(): RouterModelRegistry {
		if (!this.modelRegistryInstance) {
			this.modelRegistryInstance = new RouterModelRegistry();
		}
		return this.modelRegistryInstance;
	}
	get models(): Record<RouteId, AnyRouteModel> {
		return this.modelRegistry.models;
	}
	addModel(routeId: RouteId, model: AnyRouteModel): void {
		return this.modelRegistry.addModel(routeId, model);
	}
	findModel(routeId: RouteId): AnyRouteModel | undefined {
		if (!this.modelRegistryInstance) {
			return undefined;
		}
		return this.modelRegistry.findModel(routeId);
	}
}
