import type { MiddlewareHandler } from "@/modules/Middleware/types/MiddlewareHandler";

export type RouterMiddlewareData = {
	handler: MiddlewareHandler;
	order: number;
};
