import type { RouteInterface } from "@/modules/Route/RouteInterface";
import type { RouteHandler } from "@/modules/Route/types/RouteHandler";
import type { RouteDefinition } from "@/modules/Route/types/RouteDefinition";
import type { RouteModel } from "@/modules/Parser/types/RouteSchemas";
import type { RouteId } from "@/modules/Route/types/RouteId";
import type { MiddlewareHandler } from "@/modules/Middleware/types/MiddlewareHandler";

export interface ControllerInterface<Prefix extends string = string> {
	prefix?: Prefix | undefined;
	beforeEach?: MiddlewareHandler | undefined;
	routeIds: Set<RouteId>;
	route<
		Path extends string = string,
		R = unknown,
		B = unknown,
		S = unknown,
		P = unknown,
	>(
		definition: RouteDefinition<Path>,
		callback: RouteHandler<R, B, S, P>,
		schemas?: RouteModel<R, B, S, P>,
	): RouteInterface<Path, R, B, S, P>;
}
