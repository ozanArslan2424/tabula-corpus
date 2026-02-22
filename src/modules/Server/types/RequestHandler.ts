import type { HttpRequestInterface } from "@/modules/HttpRequest/HttpRequestInterface";
import type { HttpResponseInterface } from "@/modules/HttpResponse/HttpResponseInterface";
import type { MaybePromise } from "@/types/MaybePromise";

export type RequestHandler<R = unknown> = (
	req: HttpRequestInterface,
) => MaybePromise<HttpResponseInterface<R>>;
