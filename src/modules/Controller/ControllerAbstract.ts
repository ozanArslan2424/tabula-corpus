import type { ControllerInterface } from "@/modules/Controller/ControllerInterface";
import type { RouteInterface } from "@/modules/Route/RouteInterface";
import { Route } from "@/modules/Route/Route";
import type { ControllerOptions } from "@/modules/Controller/types/ControllerOptions";
import type { RouteHandler } from "@/modules/Route/types/RouteHandler";
import type { RouteDefinition } from "@/modules/Route/types/RouteDefinition";
import type { RouteModel } from "@/modules/Parser/types/RouteSchemas";
import { joinPathSegments } from "@/utils/joinPathSegments";
import { textIsDefined } from "@/utils/textIsDefined";
import { Method } from "@/modules/HttpRequest/enums/Method";
import type { RouteId } from "@/modules/Route/types/RouteId";
import { Router } from "@/modules/Router/Router";

/** Extend this class to create your own controllers. */

export abstract class ControllerAbstract<
	Prefix extends string = string,
> implements ControllerInterface {
	constructor(private readonly opts?: ControllerOptions<Prefix>) {}

	routeIds: Set<RouteId> = new Set<RouteId>();

	get prefix(): string | undefined {
		const globalPrefix = Router.globalPrefix;
		if (textIsDefined(globalPrefix)) {
			return joinPathSegments(globalPrefix, this.opts?.prefix);
		}
		return this.opts?.prefix;
	}

	route<
		Path extends string = string,
		B = unknown,
		R = unknown,
		S = unknown,
		P = unknown,
	>(
		definition: RouteDefinition<Path>,
		handler: RouteHandler<B, R, S, P>,
		schemas?: RouteModel<B, R, S, P>,
	): RouteInterface<Path, B, R, S, P> {
		const route = new Route(
			this.resolveRouteDefinition(definition),
			async (ctx) => {
				await this.opts?.beforeEach?.(ctx);
				return handler(ctx);
			},
			schemas,
		);
		this.routeIds.add(route.id);
		return route;
	}

	protected resolveRouteDefinition<Path extends string = string>(
		definition: RouteDefinition<Path>,
	): RouteDefinition<Path> {
		const path = typeof definition === "string" ? definition : definition.path;
		const method =
			typeof definition === "string" ? Method.GET : definition.method;

		if (textIsDefined(this.prefix)) {
			return { method, path: joinPathSegments(this.prefix, path) };
		}

		return { method, path };
	}
}
