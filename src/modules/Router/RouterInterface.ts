import type { HttpRequestInterface } from "@/modules/HttpRequest/HttpRequestInterface";
import type { MiddlewareOptions } from "@/modules/Middleware/types/MiddlewareOptions";
import type { AnyRouteModel } from "@/modules/Parser/types/AnyRouteModel";
import type { AnyRoute } from "@/modules/Route/types/AnyRoute";
import type { RouteId } from "@/modules/Route/types/RouteId";
import type { RouterMiddlewareRegistry } from "@/modules/Router/registries/RouterMiddlewareRegistry";
import { RouterModelRegistry } from "@/modules/Router/registries/RouterModelRegistry";
import type { RouterRouteRegistry } from "@/modules/Router/registries/RouterRouteRegistry";
import type { RegisteredRouteData } from "@/modules/Router/types/RegisteredRouteData";
import type { RouterMiddlewareData } from "@/modules/Router/types/RouterMiddlewareData";

export interface RouterInterface {
	globalPrefix: string;
	setGlobalPrefix(value: string): void;

	// TODO: Caching for  routes
	routeRegistryInstance: RouterRouteRegistry | undefined;
	get routeRegistry(): RouterRouteRegistry;
	get routes(): Record<RouteId, RegisteredRouteData>;
	addRoute(r: AnyRoute): void;
	findRoute(req: HttpRequestInterface): RegisteredRouteData;

	middlewareRegistryInstance: RouterMiddlewareRegistry | undefined;
	get middlewareRegistry(): RouterMiddlewareRegistry;
	get middlewares(): Record<RouteId, Array<RouterMiddlewareData>>;
	addMiddleware(opts: MiddlewareOptions): void;
	findMiddleware(routeId: RouteId): Array<RouterMiddlewareData>;

	modelRegistryInstance: RouterModelRegistry | undefined;
	get modelRegistry(): RouterModelRegistry;
	get models(): Record<RouteId, AnyRouteModel>;
	addModel(routeId: RouteId, model?: AnyRouteModel): void;
	findModel(routeId: RouteId): AnyRouteModel | undefined;
}
