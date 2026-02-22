import type { HttpRequestInterface } from "@/modules/HttpRequest/HttpRequestInterface";
import { Parser } from "@/modules/Parser/Parser";
import type { ContextInterface } from "@/modules/Context/ContextInterface";
import type { ModelRegistryData } from "@/modules/Registry/types/ModelRegistryData";
import type { CookiesInterface } from "@/exports";
import type { ContextDataInterface } from "@/types.d.ts";
import type { HttpHeadersInterface } from "@/modules/HttpHeaders/HttpHeadersInterface";
import { HttpResponse } from "@/modules/HttpResponse/HttpResponse";
import type { HttpResponseInterface } from "@/modules/HttpResponse/HttpResponseInterface";

/**
 * The context object used in Route "callback" parameter.
 * Takes 4 generics:
 * R = The return type
 * B = Request body
 * S = Request URL search params
 * P = Request URL params
 * The types are resolved using Route "model" parameter.
 *
 * Contains:
 * req = {@link HTTPRequest} instance
 * url = Request {@link URL} object
 * headers = Request {@link HTTPHeaders}
 * cookies = Request {@link Cookies}
 * body = Parsed Request body
 * search = Parsed Request URL search params
 * params = Parsed Request URL params
 * res = To set the {@link HTTPResponse} data
 * */

export class Context<
	R = unknown,
	B = unknown,
	S = unknown,
	P = unknown,
> implements ContextInterface<R, B, S, P> {
	constructor(
		readonly req: HttpRequestInterface,
		body: B,
		search: S,
		params: P,
		res?: HttpResponseInterface<R>,
	) {
		this.url = req.urlObject;
		this.headers = req.headers;
		this.cookies = req.cookies;
		this.body = body;
		this.search = search;
		this.params = params;
		this.res = res ?? new HttpResponse<R>();
	}

	url: URL;
	headers: HttpHeadersInterface;
	cookies: CookiesInterface;
	body: B;
	search: S;
	params: P;
	res: HttpResponseInterface<R>;
	data: ContextDataInterface = {};

	static makeFromRequest(req: HttpRequestInterface): ContextInterface {
		return new Context(req, {}, {}, {});
	}

	static async appendParsedData<
		Path extends string = string,
		R = unknown,
		B = unknown,
		S = unknown,
		P = unknown,
	>(
		ctx: ContextInterface<R, B, S, P>,
		req: HttpRequestInterface,
		endpoint: Path,
		model?: ModelRegistryData<R, B, S, P>,
	) {
		ctx.body = await Parser.getBody(req, model?.body);
		ctx.search = await Parser.getSearch(ctx.url, model?.search);
		ctx.params = await Parser.getParams(endpoint, ctx.url, model?.params);
	}
}
