import { __Coreum_Cookies } from "@/lib/Cookies/__Coreum_Cookies";
import { __Coreum_Headers } from "@/lib/Headers/__Coreum_Headers";
import { __Coreum_Request } from "@/lib/Request/__Coreum_Request";
import { __Coreum_Status } from "@/lib/Status/__Coreum_Status";
import type { __Coreum_RouteSchemas } from "@/lib/Route/__Coreum_RouteSchemas";
import { __Coreum_Error } from "@/lib/Error/__Coreum_Error";
import type { __Coreum_SchemaType } from "@/lib/Parser/__Coreum_SchemaType";
import { __Coreum_parse } from "@/lib/Parser/__Coreum_parse";
import type { __Coreum_InferSchema } from "@/lib/Parser/__Coreum_InferSchema";

export class __Coreum_Context<
	D = void,
	R = unknown,
	B = unknown,
	S = unknown,
	P = unknown,
> {
	req: __Coreum_Request;
	status: __Coreum_Status;
	statusText: string;
	headers: __Coreum_Headers;
	cookies: __Coreum_Cookies;
	url: URL;
	body: () => Promise<B>;
	search: S;
	params: P;

	constructor(
		private readonly request: Request,
		public readonly path: string,
		private readonly schemas?: __Coreum_RouteSchemas<R, B, S, P>,
		public data?: D,
	) {
		this.req = new __Coreum_Request(this.request);

		this.status = __Coreum_Status.OK;

		this.statusText = "OK";

		this.url = new URL(this.req.url);

		this.body = () => this.parseRequestBody(this.req);

		this.params = this.parseRequestParams(this.url.pathname, this.path);

		this.search = this.parseRequestSearch(this.url.searchParams);

		this.headers = new __Coreum_Headers(this.req.headers);

		this.cookies = new __Coreum_Cookies();
	}

	parseRequestSearch(searchParams: URLSearchParams): S {
		const data: Record<string, unknown> = {};

		for (const [key, value] of searchParams.entries()) {
			const processedValue = this.getProcessedValue(value);
			this.appendEntry(data, key, processedValue);
		}

		return this.parseWithSchema<S>("search", data);
	}

	parseRequestParams(requestPath: string, definedPath: string): P {
		const definedPathSegments = definedPath.split("/");
		const requestPathSegments = requestPath.split("/");

		const paramsObject: Record<string, unknown> = {};

		for (const [index, definedPathSegment] of definedPathSegments.entries()) {
			const requestPathSegment = requestPathSegments[index];

			if (
				definedPathSegment.startsWith(":") &&
				requestPathSegment !== undefined
			) {
				const paramName = definedPathSegment.slice(1);
				const paramValue = requestPathSegment;
				paramsObject[paramName] = this.getProcessedValue(paramValue);
			}
		}

		return this.parseWithSchema("params", paramsObject);
	}

	async parseRequestBody(req: __Coreum_Request): Promise<B> {
		let data;
		const empty = {} as B;

		switch (req.contentType) {
			case "json":
				data = await this.getJsonBody(req);
				break;
			case "form-urlencoded":
				data = await this.getFormUrlEncodedBody(req);
				break;
			case "form-data":
				data = await this.getFormDataBody(req);
				break;
			case "text":
				data = await this.getTextBody(req);
				break;
			case "xml":
			case "binary":
			case "pdf":
			case "image":
			case "audio":
			case "video":
				throw new __Coreum_Error(
					"unprocessable.contentType",
					__Coreum_Status.UNPROCESSABLE_ENTITY,
				);
			case "unknown":
				throw new __Coreum_Error(
					"unprocessable.body",
					__Coreum_Status.UNPROCESSABLE_ENTITY,
				);
			case "no-body-allowed":
			default:
				return empty;
		}

		return this.parseWithSchema("body", data);
		// } catch (err) {
		// 	if (err instanceof SyntaxError) return empty;
		// 	throw err;
		// }
	}

	private appendEntry(
		data: Record<string, unknown>,
		key: string,
		value: string | boolean | number,
	) {
		const existing = data[key];
		if (existing !== undefined) {
			data[key] = Array.isArray(existing)
				? [...existing, value]
				: [existing, value];
		} else {
			data[key] = value;
		}
	}

	private getProcessedValue(value: string) {
		let processedValue: string | boolean | number = value;

		if (/^-?\d+(\.\d+)?$/.test(value)) {
			processedValue = Number(value);
		} else if (
			value.toLowerCase() === "true" ||
			value.toLowerCase() === "false"
		) {
			processedValue = value.toLowerCase() === "true";
		}

		return processedValue;
	}

	private parseWithSchema<O>(
		type: "body" | "params" | "search",
		data: unknown,
	): O {
		const schema = this.schemas?.[type] as any | undefined;
		if (schema) {
			return __Coreum_parse(data, schema, `unprocessable.${type}`) as O;
		}
		return data as O;
	}

	private async getJsonBody(req: __Coreum_Request): Promise<unknown> {
		return await req.json();
	}

	private async getFormUrlEncodedBody(req: __Coreum_Request): Promise<unknown> {
		const text = await req.text();
		if (!text || text.trim().length === 0) {
			throw new SyntaxError("Body is empty");
		}

		const params = new URLSearchParams(text);
		const body: Record<string, any> = {};

		for (const [key, value] of params.entries()) {
			this.appendEntry(body, key, value);
		}

		return body;
	}

	private async getFormDataBody(req: __Coreum_Request): Promise<unknown> {
		const formData = await req.formData();
		const entries = formData.entries() as IterableIterator<
			[string, FormDataEntryValue]
		>;

		const body: Record<string, unknown> = {};

		for (const [key, value] of entries) {
			if (value instanceof File) {
				body[key] = value;
			} else {
				this.appendEntry(body, key, value);
			}
		}

		return body;
	}

	private async getTextBody(req: __Coreum_Request): Promise<unknown> {
		const contentLength = req.headers.get("content-length");
		const length = contentLength ? parseInt(contentLength) : 0;

		// 1MB threshold
		if (length > 0 && length < 1024 * 1024) {
			const text = await req.text();
			return text;
		}

		const buffer = await req.arrayBuffer();
		const contentType = req.headers.get("content-type") || "";
		const match = contentType.match(/charset=([^;]+)/i);
		const charset = match?.[1] ? match[1].trim() : null;

		const decoder = new TextDecoder(charset || "utf-8");
		const text = decoder.decode(buffer);

		return text;
	}
}
