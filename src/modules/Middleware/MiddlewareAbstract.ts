import type { MiddlewareInterface } from "@/modules/Middleware/MiddlewareInterface";
import type { MiddlewareHandler } from "@/modules/Middleware/types/MiddlewareHandler";
import type { MiddlewareOptions } from "@/modules/Middleware/types/MiddlewareOptions";
import { getRouterInstance } from "@/modules/Router/RouterInstance";

export abstract class MiddlewareAbstract implements MiddlewareInterface {
	constructor(opts: MiddlewareOptions) {
		this.handler = opts.handler;
		getRouterInstance().addMiddleware(opts);
	}

	handler: MiddlewareHandler;
}
