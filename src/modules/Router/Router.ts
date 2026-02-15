import { RouterRouteRegistry } from "@/modules/Router/RouterRouteRegistry";
import { RouterMiddlewareRegistry } from "@/modules/Router/RouterMiddlewareRegistry";
import { RouterModelRegistry } from "@/modules/Router/RouterModelRegistry";
import type { AnyRoute } from "@/modules/Route/types/AnyRoute";
import type { HttpRequestInterface } from "@/modules/HttpRequest/HttpRequestInterface";
import type { RegisteredRouteData } from "@/modules/Router/types/RegisteredRouteData";
import type { MiddlewareOptions } from "@/modules/Middleware/types/MiddlewareOptions";
import type { RouterMiddlewareData } from "@/modules/Router/types/RouterMiddlewareData";
import type { RouteId } from "@/modules/Route/types/RouteId";
import type { AnyRouteModel } from "@/modules/Parser/types/AnyRouteModel";

export class Router {
	static globalPrefix: string = "";

	static routeRegistry = new RouterRouteRegistry();

	static addRoute(r: AnyRoute) {
		return this.routeRegistry.addRoute(r);
	}

	static findRoute(req: HttpRequestInterface): RegisteredRouteData {
		return this.routeRegistry.findRoute(req);
	}

	static get routes() {
		return this.routeRegistry.routes;
	}

	static middlewareRegistry = new RouterMiddlewareRegistry();

	static addMiddleware(opts: MiddlewareOptions) {
		return this.middlewareRegistry.addMiddleware(opts);
	}

	static findMiddleware(routeId: RouteId): Array<RouterMiddlewareData> {
		return this.middlewareRegistry.findMiddleware(routeId);
	}

	static get middlewares() {
		return this.middlewareRegistry.middlewares;
	}

	static modelRegistry = new RouterModelRegistry();

	static addModel(routeId: RouteId, model?: AnyRouteModel | undefined) {
		return this.modelRegistry.addModel(routeId, model);
	}

	static findModel(routeId: RouteId): AnyRouteModel | undefined {
		return this.modelRegistry.findModel(routeId);
	}

	static get models() {
		return this.modelRegistry.models;
	}
}
