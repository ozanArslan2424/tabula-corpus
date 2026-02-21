import type { AnyRoute } from "@/modules/Route/types/AnyRoute";

export type RouteRegistryData = Pick<
	AnyRoute,
	"id" | "endpoint" | "method" | "pattern" | "handler"
>;
