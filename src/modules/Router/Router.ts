import type { AnyRoute } from "@/modules/Route/types/AnyRoute";
import type { HttpRequestInterface } from "@/modules/HttpRequest/HttpRequestInterface";
import type { RegisteredRouteData } from "@/modules/Router/types/RegisteredRouteData";
import type { MiddlewareOptions } from "@/modules/Middleware/types/MiddlewareOptions";
import type { RouterMiddlewareData } from "@/modules/Router/types/RouterMiddlewareData";
import type { RouteId } from "@/modules/Route/types/RouteId";
import type { AnyRouteModel } from "@/modules/Parser/types/AnyRouteModel";
import type { RouterInterface } from "@/modules/Router/RouterInterface";
import type { RegisteredModelData } from "@/modules/Router/types/RegisteredModelData";
import { RouteRegistry } from "@/modules/Registry/RouteRegistry";
import { MiddlewareRegistry } from "@/modules/Registry/MiddlewareRegistry";
import { ModelRegistry } from "@/modules/Registry/ModelRegistry";

export class Router implements RouterInterface {
	globalPrefix: string = "";

	setGlobalPrefix(value: string) {
		this.globalPrefix = value;
	}

	// TODO: Caching for  routes
	routeRegistryInstance: RouteRegistry | undefined;
	get routeRegistry(): RouteRegistry {
		if (!this.routeRegistryInstance) {
			this.routeRegistryInstance = new RouteRegistry();
		}
		return this.routeRegistryInstance;
	}
	get routes(): Record<RouteId, RegisteredRouteData> {
		return this.routeRegistry.data;
	}
	addRoute(r: AnyRoute): void {
		return this.routeRegistry.add(r);
	}
	findRoute(req: HttpRequestInterface): RegisteredRouteData {
		return this.routeRegistry.find(req);
	}

	middlewareRegistryInstance: MiddlewareRegistry | undefined;
	get middlewareRegistry(): MiddlewareRegistry {
		if (!this.middlewareRegistryInstance) {
			this.middlewareRegistryInstance = new MiddlewareRegistry();
		}
		return this.middlewareRegistryInstance;
	}
	get middlewares(): Record<RouteId, RouterMiddlewareData[]> {
		return this.middlewareRegistry.data;
	}
	addMiddleware(opts: MiddlewareOptions): void {
		return this.middlewareRegistry.add(opts);
	}
	findMiddleware(routeId: RouteId): Array<RouterMiddlewareData> {
		if (!this.middlewareRegistryInstance) {
			return [];
		}
		return this.middlewareRegistry.find(routeId);
	}

	modelRegistryInstance: ModelRegistry | undefined;
	get modelRegistry(): ModelRegistry {
		if (!this.modelRegistryInstance) {
			this.modelRegistryInstance = new ModelRegistry();
		}
		return this.modelRegistryInstance;
	}
	get models(): Record<RouteId, RegisteredModelData> {
		return this.modelRegistry.data;
	}
	addModel(routeId: RouteId, model: AnyRouteModel): void {
		return this.modelRegistry.add(routeId, model);
	}
	findModel(routeId: RouteId): RegisteredModelData | undefined {
		if (!this.modelRegistryInstance) {
			return undefined;
		}
		return this.modelRegistry.find(routeId);
	}
}
