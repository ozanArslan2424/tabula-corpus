import type { RouteInterface } from "@/modules/Route/RouteInterface";
import type { RouteHandler } from "@/modules/Route/types/RouteHandler";
import type { RouteDefinition } from "@/modules/Route/types/RouteDefinition";
import type { RouteModel } from "@/modules/Parser/types/RouteSchemas";
import type { RouteId } from "@/modules/Route/types/RouteId";

export interface ControllerInterface {
	get prefix(): string | undefined;
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
