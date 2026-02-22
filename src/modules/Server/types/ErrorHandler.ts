import type { HttpResponseInterface } from "@/modules/HttpResponse/HttpResponseInterface";
import type { MaybePromise } from "@/types/MaybePromise";

export type ErrorHandler<R = unknown> = (
	err: Error,
) => MaybePromise<HttpResponseInterface<R>>;
