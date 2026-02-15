import type { MiddlewareInterface } from "@/modules/Middleware/MiddlewareInterface";
import type { MiddlewareHandler } from "@/modules/Middleware/types/MiddlewareHandler";
import { Router } from "@/modules/Router/Router";
import type { MiddlewareOptions } from "@/modules/Middleware/types/MiddlewareOptions";

export abstract class MiddlewareAbstract implements MiddlewareInterface {
	constructor(opts: MiddlewareOptions) {
		this.handler = opts.handler;
		Router.addMiddleware(opts);
	}

	handler: MiddlewareHandler;
}

// use(): void;
// use(controller: ControllerInterface): ControllerInterface;
// use(route: AnyRoute): AnyRoute;
// use(
// 	input?: ControllerInterface | AnyRoute,
// ): ControllerInterface | AnyRoute | void {
// 	if (input instanceof ControllerAbstract) {
// 		return this.useOnController(input);
// 	}
// 	if (input instanceof Route) {
// 		return this.useOnRoute(input);
// 	}
// 	return this.useGlobally();
// }
//
// useGlobally(): void {
// 	getServerInstance()
// 		.router.listRoutes()
// 		.forEach((route) => {
// 			this.useOnRoute(route);
// 		});
// }
//
// useOnController(controller: ControllerInterface): ControllerInterface {
// 	const controllerRoutes = getServerInstance()
// 		.router.listRoutes()
// 		.filter((r) => r.controllerId === controller.id);
// 	for (const route of controllerRoutes) {
// 		this.useOnRoute(route);
// 	}
// 	return controller;
// }
//
// useOnRoute(route: AnyRoute): AnyRoute {
// 	const originalHandler = route.handler;
// 	route.handler = async (ctx) => {
// 		await this.handler(ctx);
// 		return await originalHandler(ctx);
// 	};
// 	getServerInstance().router.update(route);
// 	return route;
// }
