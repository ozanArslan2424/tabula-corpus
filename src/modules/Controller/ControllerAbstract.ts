import type { ControllerInterface } from "@/modules/Controller/ControllerInterface";
import type { RouteInterface } from "@/modules/Route/RouteInterface";
import { Route } from "@/modules/Route/Route";
import type { ControllerOptions } from "@/modules/Controller/types/ControllerOptions";
import type { RouteHandler } from "@/modules/Route/types/RouteHandler";
import type { RouteDefinition } from "@/modules/Route/types/RouteDefinition";
import type { RouteModel } from "@/modules/Parser/types/RouteSchemas";
import { joinPathSegments } from "@/utils/joinPathSegments";
import { Method } from "@/modules/HttpRequest/enums/Method";
import type { RouteId } from "@/modules/Route/types/RouteId";
import { StaticRoute } from "@/modules/StaticRoute/StaticRoute";
import type { StaticRouteInterface } from "@/modules/StaticRoute/StaticRouteInterface";
import type { OrString } from "@/utils/OrString";

/** Extend this class to create your own controllers. */

export abstract class ControllerAbstract<
	Prefix extends string = string,
> implements ControllerInterface {
	constructor(private readonly opts?: ControllerOptions<Prefix>) {}

	routeIds: Set<RouteId> = new Set<RouteId>();

	get prefix(): string | undefined {
		// const globalPrefix = Router.globalPrefix;
		// if (textIsDefined(globalPrefix)) {
		// 	return joinPathSegments(globalPrefix, this.opts?.prefix);
		// }
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
			{
				method: typeof definition === "string" ? Method.GET : definition.method,
				path: joinPathSegments<Path>(
					this.prefix,
					typeof definition === "string" ? definition : definition.path,
				),
			},
			async (ctx) => {
				await this.opts?.beforeEach?.(ctx);
				return handler(ctx);
			},
			schemas,
		);
		this.routeIds.add(route.id);
		return route;
	}

	staticRoute<Path extends string = string>(
		path: Path,
		filePath: string,
		extension?: OrString<"html" | "css" | "js" | "ts">,
	): StaticRouteInterface<Path> {
		const route = new StaticRoute(
			joinPathSegments<Path>(this.prefix, path),
			filePath,
			extension,
		);
		this.routeIds.add(route.id);
		return route;
	}
}
