import { HttpRequest } from "@/modules/HttpRequest/HttpRequest";
import type { HttpRequestInterface } from "@/modules/HttpRequest/HttpRequestInterface";
import { Parser } from "@/modules/Parser/Parser";
import { ContextAbstract } from "@/modules/Context/ContextAbstract";
import type { ContextInterface } from "@/modules/Context/ContextInterface";
import type { RouteModel } from "@/modules/Parser/types/RouteSchemas";

/**
 * The context object used in Route "callback" parameter.
 * Takes 5 generics:
 * D = Data passed through a {@link Middleware}
 * R = The return type
 * B = Request body
 * S = Request URL search params
 * P = Request URL params
 * The types are resolved using Route "schemas" parameter except D
 * which you may want to pass if you have middleware data.
 *
 * Contains:
 * req = {@link Request} instance
 * url = Request URL
 * body = Async function to get the parsed Request body
 * search = Parsed Request URL search params
 * params = Parsed Request URL params
 * status = To set the Response status
 * statusText = To set the Response statusText
 * headers = To set the Response {@link Headers}
 * cookies = To set the Response {@link Cookies}
 * */

export class Context<R = unknown, B = unknown, S = unknown, P = unknown>
	extends ContextAbstract<R, B, S, P>
	implements ContextInterface<R, B, S, P>
{
	static async makeFromRequest<
		Path extends string = string,
		R = unknown,
		B = unknown,
		S = unknown,
		P = unknown,
	>(
		request: HttpRequestInterface,
		path: Path,
		model?: RouteModel<R, B, S, P>,
	): Promise<ContextInterface<R, B, S, P>> {
		const req = new HttpRequest(request);
		const url = new URL(req.url);
		const headers = req.headers;
		const cookies = req.cookies;

		const body = await Parser.getBody(req, model?.body);
		const search = await Parser.getSearch(url, model?.search);
		const params = await Parser.getParams(path, url, model?.params);

		return new Context(req, url, headers, cookies, body, search, params);
	}
}
