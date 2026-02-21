import type { RouteHandler } from "@/modules/Route/types/RouteHandler";
import type { RouteId } from "@/modules/Route/types/RouteId";
import type { Method } from "@/modules/HttpRequest/enums/Method";
import type { RouteVariant } from "@/modules/Route/enums/RouteVariant";

export interface RouteInterface<
	Path extends string = string,
	R = unknown,
	B = unknown,
	S = unknown,
	P = unknown,
> {
	id: RouteId;
	variant: RouteVariant;
	method: Method;
	endpoint: Path;
	pattern: RegExp;
	handler: RouteHandler<R, B, S, P>;
}
