import type { AnyRoute } from "@/modules/Route/types/AnyRoute";

export type RegisteredRouteData = Pick<
	AnyRoute,
	"id" | "path" | "method" | "pattern" | "handler"
>;
