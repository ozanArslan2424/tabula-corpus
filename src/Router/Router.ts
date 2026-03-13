import { Context } from "@/Context/Context";
import type { CRequest } from "@/CRequest/CRequest";
import { CResponse } from "@/CResponse/CResponse";
import type { AnyRoute } from "@/Route/types/AnyRoute";
import type { Func } from "@/utils/types/Func";
import type { RouterAdapterInterface } from "@/Router/adapters/RouterAdapterInterface";
import { CorpusAdapter } from "@/Router/adapters/CorpusAdapter";
import type { RouterRouteData } from "@/Router/types/RouterRouteData";
import type { AnyRouteModel } from "@/Model/types/AnyRouteModel";
import type { Middleware } from "@/Middleware/Middleware";

export class Router {
	constructor(adapter?: RouterAdapterInterface) {
		this._adapter = adapter ?? new CorpusAdapter();
	}

	private _adapter: RouterAdapterInterface;
	private cache = new WeakMap<CRequest, Func<[], Promise<CResponse>>>();

	checkPossibleCollision(n: RouterRouteData): boolean {
		if (this._adapter instanceof CorpusAdapter) {
			return this._adapter.checkPossibleCollision(n);
		}
		return false;
	}

	addModel(route: AnyRoute, model: AnyRouteModel): void {
		this._adapter.addModel(route, model);
	}

	addMiddleware(middleware: Middleware): void {
		this._adapter.addMiddleware(middleware);
	}

	addRoute(route: AnyRoute): void {
		this._adapter.addRoute({
			id: route.id,
			endpoint: route.endpoint,
			method: route.method,
			handler: route.handler,
			pattern: route.pattern,
		});
	}

	findRouteHandler(req: CRequest): Func<[], Promise<CResponse>> | null {
		const cached = this.cache.get(req);
		if (cached) return cached;

		const match = this._adapter.find(req);
		if (!match) {
			return null;
		}

		const ctx = Context.makeFromRequest(req);
		const handler = async () => {
			await match.middleware?.(ctx);
			await Context.appendParsedData(
				ctx,
				req,
				match.params,
				match.search,
				match.model,
			);
			const result = await match.route.handler(ctx);

			if (result instanceof CResponse) {
				return result;
			}

			return new CResponse(result, ctx.res);
		};

		this.cache.set(req, handler);
		return handler;
	}

	getRouteList(): Array<[string, string]> {
		return this._adapter.list().map((v) => [v.method, v.endpoint]);
	}
}
