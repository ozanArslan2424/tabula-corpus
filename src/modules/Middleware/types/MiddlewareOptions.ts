import type { MiddlewareHandler } from "@/modules/Middleware/types/MiddlewareHandler";
import type { MiddlewareUseOn } from "@/modules/Middleware/types/MiddlewareUseOn";

export type MiddlewareOptions = {
	useOn: MiddlewareUseOn;
	handler: MiddlewareHandler;
};
