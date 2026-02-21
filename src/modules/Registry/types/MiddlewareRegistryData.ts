import type { MiddlewareHandler } from "@/modules/Middleware/types/MiddlewareHandler";

export type MiddlewareRegistryData = {
	handler: MiddlewareHandler;
	order: number;
};
