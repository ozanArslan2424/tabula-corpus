import type { HttpRequestInterface } from "@/modules/HttpRequest/HttpRequestInterface";
import { CommonHeaders } from "@/modules/HttpHeaders/enums/CommonHeaders";
import { Cookies } from "@/modules/Cookies/Cookies";
import { HttpHeaders } from "@/modules/HttpHeaders/HttpHeaders";
import type { HttpRequestInfo } from "@/modules/HttpRequest/types/HttpRequestInfo";
import type { HttpRequestInit } from "@/modules/HttpRequest/types/HttpRequestInit";
import { strSplit } from "@/utils/strSplit";
import type { CookiesInterface } from "@/modules/Cookies/CookiesInterface";
import type { HttpHeadersInterface } from "@/modules/HttpHeaders/HttpHeadersInterface";
import { Method } from "@/modules/HttpRequest/enums/Method";

/** HttpRequest includes a cookie jar, better headers, and some utilities. */

export class HttpRequest extends Request implements HttpRequestInterface {
	constructor(
		readonly input: HttpRequestInfo,
		readonly init?: HttpRequestInit,
	) {
		super(input, init);
	}

	get urlObject(): URL {
		return new URL(this.url);
	}

	override get headers(): HttpHeadersInterface {
		if (this.input instanceof Request) {
			return new HttpHeaders(this.input.headers);
		} else if (this.init?.headers !== undefined) {
			return new HttpHeaders(this.init.headers);
		} else {
			return new HttpHeaders();
		}
	}

	/** Gets cookie header and collects cookies for the jar */
	get cookies(): CookiesInterface {
		const jar = new Cookies();

		const cookieHeader = this.headers.get(CommonHeaders.Cookie);

		if (cookieHeader) {
			const pairs = strSplit(";", cookieHeader);

			for (const pair of pairs) {
				const [name, value] = strSplit("=", pair);
				if (!name || !value) continue;
				jar.set({ name, value });
			}
		}

		return jar;
	}

	get isPreflight(): boolean {
		const accessControlRequestMethodHeader = this.headers.has(
			CommonHeaders.AccessControlRequestMethod,
		);
		return this.method === Method.OPTIONS && accessControlRequestMethodHeader;
	}
}
