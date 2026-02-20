import type { MiddlewareHandler } from "@/modules/Middleware/types/MiddlewareHandler";

export type ControllerOptions = {
	prefix?: string;
	beforeEach?: MiddlewareHandler;
};
