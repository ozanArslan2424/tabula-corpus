import type { HttpRequestInterface } from "@/modules/HttpRequest/HttpRequestInterface";
import type { MiddlewareOptions } from "@/modules/Middleware/types/MiddlewareOptions";
import type { AnyRouteModel } from "@/modules/Parser/types/AnyRouteModel";
import type { MiddlewareRegistry } from "@/modules/Registry/MiddlewareRegistry";
import type { ModelRegistry } from "@/modules/Registry/ModelRegistry";
import type { RouteRegistry } from "@/modules/Registry/RouteRegistry";
import type { AnyRoute } from "@/modules/Route/types/AnyRoute";
import type { RouteId } from "@/modules/Route/types/RouteId";
import type { RegisteredModelData } from "@/modules/Router/types/RegisteredModelData";
import type { RegisteredRouteData } from "@/modules/Router/types/RegisteredRouteData";
import type { RouterMiddlewareData } from "@/modules/Router/types/RouterMiddlewareData";

export interface RouterInterface {
	globalPrefix: string;
	setGlobalPrefix(value: string): void;

	// TODO: Caching for  routes
	routeRegistryInstance: RouteRegistry | undefined;
	get routeRegistry(): RouteRegistry;
	get routes(): Record<RouteId, RegisteredRouteData>;
	addRoute(r: AnyRoute): void;
	findRoute(req: HttpRequestInterface): RegisteredRouteData;

	middlewareRegistryInstance: MiddlewareRegistry | undefined;
	get middlewareRegistry(): MiddlewareRegistry;
	get middlewares(): Record<RouteId, Array<RouterMiddlewareData>>;
	addMiddleware(opts: MiddlewareOptions): void;
	findMiddleware(routeId: RouteId): Array<RouterMiddlewareData>;

	modelRegistryInstance: ModelRegistry | undefined;
	get modelRegistry(): ModelRegistry;
	get models(): Record<RouteId, RegisteredModelData>;
	addModel(routeId: RouteId, model?: AnyRouteModel): void;
	findModel(routeId: RouteId): RegisteredModelData | undefined;
}
