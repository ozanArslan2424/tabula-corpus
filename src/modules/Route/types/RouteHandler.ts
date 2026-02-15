import type { ContextInterface } from "@/modules/Context/ContextInterface";
import type { MaybePromise } from "@/utils/MaybePromise";

export type RouteHandler<R = unknown, B = unknown, S = unknown, P = unknown> = (
	context: ContextInterface<R, B, S, P>,
) => MaybePromise<R>;
