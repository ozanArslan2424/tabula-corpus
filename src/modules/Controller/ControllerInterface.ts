import type { RouteId } from "@/modules/Route/types/RouteId";

export interface ControllerInterface {
	routeIds: Set<RouteId>;
}
