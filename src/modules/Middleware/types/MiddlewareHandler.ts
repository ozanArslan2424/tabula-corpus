import type { ContextInterface } from "@/modules/Context/ContextInterface";
import type { MaybePromise } from "@/utils/MaybePromise";

export type MiddlewareHandler = (
	context: ContextInterface,
) => MaybePromise<void>;
