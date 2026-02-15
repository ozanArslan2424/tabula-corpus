import type { HttpHeadersInterface } from "@/modules/HttpHeaders/HttpHeadersInterface";
import type { HttpRequestInterface } from "@/modules/HttpRequest/HttpRequestInterface";
import type { CookiesInterface } from "@/modules/Cookies/CookiesInterface";
import type { HttpResponseInterface } from "@/modules/HttpResponse/HttpResponseInterface";
import type { ContextDataInterface } from "@/types";

export interface ContextInterface<
	R = unknown,
	B = unknown,
	S = unknown,
	P = unknown,
> {
	readonly req: HttpRequestInterface;
	readonly url: URL;
	readonly headers: HttpHeadersInterface;
	readonly cookies: CookiesInterface;
	readonly body: B;
	readonly search: S;
	readonly params: P;
	res: HttpResponseInterface<R>;
	data: ContextDataInterface;
}
