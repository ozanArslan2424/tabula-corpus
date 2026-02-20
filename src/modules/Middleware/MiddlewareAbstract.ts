import type { MiddlewareUseOn } from "@/exports";
import type { MiddlewareInterface } from "@/modules/Middleware/MiddlewareInterface";
import type { MiddlewareHandler } from "@/modules/Middleware/types/MiddlewareHandler";
import { getRouterInstance } from "@/modules/Router/RouterInstance";

/**
 * Simple middleware that runs before the Route "callback" parameters.
 * Manipulates context.
 * */

export abstract class MiddlewareAbstract implements MiddlewareInterface {
	constructor() {
		this.registerThis();
	}

	abstract handler: MiddlewareHandler;
	abstract useOn: MiddlewareUseOn;

	static register(opts: {
		handler: MiddlewareHandler;
		useOn: MiddlewareUseOn;
	}) {
		getRouterInstance().addMiddleware(opts);
	}

	private registerThis() {
		getRouterInstance().addMiddleware(this);
	}
}
