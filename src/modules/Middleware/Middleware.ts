import type { MiddlewareInterface } from "@/modules/Middleware/MiddlewareInterface";
import type { MiddlewareHandler } from "@/modules/Middleware/types/MiddlewareHandler";
import type { MiddlewareOptions } from "@/modules/Middleware/types/MiddlewareOptions";
import type { MiddlewareUseOn } from "@/modules/Middleware/types/MiddlewareUseOn";
import { getRouterInstance } from "@/modules/Router/RouterInstance";

/**
 * Simple middleware that runs before the Route "callback" parameters.
 * Manipulates context.
 * */

export class Middleware implements MiddlewareInterface {
	constructor(opts: MiddlewareOptions) {
		this.useOn = opts.useOn;
		this.handler = opts.handler;
		getRouterInstance().addMiddleware(opts);
	}

	useOn: MiddlewareUseOn;
	handler: MiddlewareHandler;
}
