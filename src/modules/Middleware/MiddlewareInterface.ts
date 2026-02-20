import type { MiddlewareUseOn } from "@/exports";
import type { MiddlewareHandler } from "@/modules/Middleware/types/MiddlewareHandler";

export interface MiddlewareInterface {
	handler: MiddlewareHandler;
	useOn: MiddlewareUseOn;
}
