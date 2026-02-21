import type { MiddlewareHandler } from "@/modules/Middleware/types/MiddlewareHandler";
import type { MiddlewareUseOn } from "@/modules/Middleware/types/MiddlewareUseOn";

export interface MiddlewareInterface {
	useOn: MiddlewareUseOn;
	handler: MiddlewareHandler;
}
