import type { __Coreum_Method } from "@/lib/Method/__Coreum_Method";
import type { __Coreum_Endpoint } from "@/lib/Route/__Coreum_Endpoint";

export type __Coreum_RouteDefinition =
	| { method: __Coreum_Method; path: __Coreum_Endpoint }
	| __Coreum_Endpoint;
