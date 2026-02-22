import type { RouteInterface } from "@/modules/Route/RouteInterface";
import type { RouteId } from "@/modules/Route/types/RouteId";
import type { RouteDefinition } from "@/modules/Route/types/RouteDefinition";
import { Method } from "@/modules/HttpRequest/enums/Method";
import { joinPathSegments } from "@/utils/joinPathSegments";
import { RouteVariant } from "@/modules/Route/enums/RouteVariant";
import type { RouteHandler } from "@/modules/Route/types/RouteHandler";
import { getRouterInstance } from "@/index";
import { Route } from "@/modules/Route/Route";

export abstract class RouteAbstract<
	Path extends string = string,
	R = unknown,
	B = unknown,
	S = unknown,
	P = unknown,
> implements RouteInterface<Path, R, B, S, P> {
	abstract variant: RouteVariant;
	abstract endpoint: Path;
	abstract method: Method;
	abstract pattern: RegExp;
	abstract id: RouteId;
	abstract handler: RouteHandler<R, B, S, P>;

	resolveEndpoint(
		definition: RouteDefinition<Path>,
		variant: RouteVariant,
	): Path {
		const endpoint =
			typeof definition === "string" ? definition : definition.path;
		if (variant === RouteVariant.dynamic) {
			return joinPathSegments(getRouterInstance().globalPrefix, endpoint);
		}
		return endpoint;
	}

	resolveMethod(definition: RouteDefinition<Path>): Method {
		return typeof definition === "string" ? Method.GET : definition.method;
	}

	resolvePattern(endpoint: Path): RegExp {
		// Convert route pattern to regex: "/users/:id" -> /^\/users\/([^\/]+)$/
		const regex = endpoint
			.split("/")
			.map((part) => (part.startsWith(":") ? "([^\\/]+)" : part))
			.join("/");
		return new RegExp(`^${regex}$`);
	}

	resolveId(method: Method, endpoint: Path): RouteId {
		return Route.makeRouteId(method, endpoint);
	}
}
