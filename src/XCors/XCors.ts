import type { CRequest } from "@/CRequest/CRequest";
import type { CResponse } from "@/CResponse/CResponse";
import type { CorsOptions } from "@/XCors/types/CorsOptions";
import { boolToString } from "@/utils/boolToString";
import { isSomeArray } from "@/utils/isSomeArray";
import { _corsStore } from "@/index";
import { arrMerge } from "@/utils/arrMerge";
import type { CHeaders } from "@/CHeaders/CHeaders";

/** Simple cors helper object to set cors headers */

export class XCors {
	constructor(public opts: CorsOptions | undefined) {
		if (opts === undefined) {
			_corsStore.set(null);
		} else {
			_corsStore.set(this);
		}
	}

	private readonly originKey = "Access-Control-Allow-Origin";
	private readonly methodsKey = "Access-Control-Allow-Methods";
	private readonly headersKey = "Access-Control-Allow-Headers";
	private readonly credentialsKey = "Access-Control-Allow-Credentials";
	private readonly exposedHeadersKey = "Access-Control-Expose-Headers";

	private getCorsHeaders(req: CRequest, res: CResponse): CHeaders {
		const reqOrigin = req.headers.get("origin") ?? "";

		const {
			allowedOrigins,
			allowedMethods,
			allowedHeaders,
			exposedHeaders,
			credentials,
		} = this.opts ?? {};

		if (isSomeArray(allowedOrigins) && allowedOrigins.includes(reqOrigin)) {
			res.headers.set(this.originKey, reqOrigin);
		}

		if (isSomeArray(allowedMethods)) {
			res.headers.set(this.methodsKey, allowedMethods.join(", "));
		}

		if (isSomeArray(allowedHeaders)) {
			res.headers.set(this.headersKey, allowedHeaders.join(", "));
		}

		if (isSomeArray(exposedHeaders)) {
			res.headers.set(this.exposedHeadersKey, exposedHeaders.join(", "));
		}

		res.headers.set(this.credentialsKey, boolToString(credentials));

		return res.headers;
	}

	apply(req: CRequest, res: CResponse): void {
		const headers = this.getCorsHeaders(req, res);
		res.headers.innerCombine(headers);
	}

	updateOptions(newOpts: CorsOptions) {
		this.opts = {
			...this.opts,
			...newOpts,
			allowedHeaders: arrMerge(
				this.opts?.allowedHeaders,
				newOpts.allowedHeaders,
			),
			allowedMethods: arrMerge(
				this.opts?.allowedMethods,
				newOpts.allowedMethods,
			),
			allowedOrigins: arrMerge(
				this.opts?.allowedOrigins,
				newOpts.allowedOrigins,
			),
			exposedHeaders: arrMerge(
				this.opts?.exposedHeaders,
				newOpts.exposedHeaders,
			),
		};

		_corsStore.set(this);
	}
}
