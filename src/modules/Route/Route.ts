import type { RouteInterface } from "@/modules/Route/RouteInterface";
import { RouteAbstract } from "@/modules/Route/RouteAbstract";
import type { RouteModel } from "@/modules/Parser/types/RouteSchemas";
import type { RouteDefinition } from "@/modules/Route/types/RouteDefinition";
import type { RouteHandler } from "@/modules/Route/types/RouteHandler";
import type { Method } from "@/modules/HttpRequest/enums/Method";
import type { RouteId } from "@/modules/Route/types/RouteId";
import { RouteVariant } from "@/modules/Route/enums/RouteVariant";
import { getRouterInstance } from "@/modules/Router/RouterInstance";

/**
 * The object to define an endpoint. Can be instantiated with "new" or inside a controller
 * with {@link Controller.route}. The callback recieves the {@link RouteContext} and can
 * return {@link HttpResponse} or any data. Route instantiation automatically registers
 * to the router.
 * */

export class Route<
	Path extends string = string,
	R = unknown,
	B = unknown,
	S = unknown,
	P = unknown,
>
	extends RouteAbstract<Path, R, B, S, P>
	implements RouteInterface<Path, R, B, S, P>
{
	constructor(
		protected readonly definition: RouteDefinition<Path>,
		readonly handler: RouteHandler<R, B, S, P>,
		model?: RouteModel<R, B, S, P>,
	) {
		super();
		this.variant = RouteVariant.dynamic;
		this.endpoint = this.resolveEndpoint(definition, this.variant);
		this.method = this.resolveMethod(definition);
		this.pattern = this.resolvePattern(this.endpoint);
		this.id = this.resolveId(this.method, this.endpoint);

		getRouterInstance().addRoute(this);
		if (model) {
			getRouterInstance().addModel(this.id, model);
		}
	}

	variant: RouteVariant;
	endpoint: Path;
	method: Method;
	pattern: RegExp;
	id: RouteId;
}
