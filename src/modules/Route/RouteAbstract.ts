import type { RouteInterface } from "@/modules/Route/RouteInterface";
import type { RouteId } from "@/modules/Route/types/RouteId";
import type { RouteHandler } from "@/modules/Route/types/RouteHandler";
import type { RouteModel } from "@/modules/Parser/types/RouteSchemas";
import { joinPathSegments } from "@/utils/joinPathSegments";
import { textIsDefined } from "@/utils/textIsDefined";
import type { RouteDefinition } from "@/modules/Route/types/RouteDefinition";
import { Method } from "@/modules/HttpRequest/enums/Method";
import { Router } from "@/modules/Router/Router";

export abstract class RouteAbstract<
	Path extends string = string,
	R = unknown,
	B = unknown,
	S = unknown,
	P = unknown,
> implements RouteInterface<Path, R, B, S, P> {
	constructor(
		private readonly definition: RouteDefinition<Path>,
		handler: RouteHandler<R, B, S, P>,
		model?: RouteModel<R, B, S, P>,
	) {
		this.handler = handler;
		Router.addRoute(this);
		Router.addModel(this.id, model);
	}

	handler: RouteHandler<R, B, S, P>;

	get path(): Path {
		const endpoint =
			typeof this.definition === "string"
				? this.definition
				: this.definition.path;
		const globalPrefix = Router.globalPrefix;
		if (textIsDefined(globalPrefix) && !endpoint.startsWith(globalPrefix)) {
			return joinPathSegments(globalPrefix, endpoint);
		}
		return endpoint;
	}

	get method(): Method {
		return typeof this.definition === "string"
			? Method.GET
			: this.definition.method;
	}

	get pattern(): RegExp {
		// Convert route pattern to regex: "/users/:id" -> /^\/users\/([^\/]+)$/
		const regex = this.path
			.split("/")
			.map((part) => (part.startsWith(":") ? "([^\\/]+)" : part))
			.join("/");
		return new RegExp(`^${regex}$`);
	}

	get id(): RouteId {
		return `[${this.method.toUpperCase()}]:[${this.path}]`;
	}
}
