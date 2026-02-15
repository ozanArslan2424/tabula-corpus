import type { RouteHandler } from "@/modules/Route/types/RouteHandler";
import type { RouteId } from "@/modules/Route/types/RouteId";
import type { RouteModel } from "@/modules/Parser/types/RouteSchemas";
import type { Method } from "@/modules/HttpRequest/enums/Method";
import type { ControllerId } from "@/modules/Controller/types/ControllerId";

export interface RouteInterface<
	Path extends string = string,
	R = unknown,
	B = unknown,
	S = unknown,
	P = unknown,
> {
	handler: RouteHandler<R, B, S, P>;
	readonly model?: RouteModel<R, B, S, P>;
	readonly controllerId?: ControllerId;
	get path(): Path;
	get method(): Method;
	get pattern(): RegExp;
	get id(): RouteId;
}
