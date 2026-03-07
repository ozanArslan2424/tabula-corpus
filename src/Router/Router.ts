import { Context } from "@/Context/Context";
import { ControllerAbstract } from "@/Controller/ControllerAbstract";
import type { HttpRequest } from "@/Request/HttpRequest";
import { HttpResponse } from "@/Response/HttpResponse";
import type { AnyRoute } from "@/Route/types/AnyRoute";
import type { AnyRouteModel } from "@/Model/types/AnyRouteModel";
import type { RouterMiddlewareData } from "@/Router/types/RouterMiddlewareData";
import type { RouterModelData } from "@/Router/types/RouterModelData";
import type { RouteId } from "@/Route/types/RouteId";
import { HttpError } from "@/Error/HttpError";
import { strRemoveWhitespace } from "@/utils/strRemoveWhitespace";
import type { Func } from "@/utils/types/Func";
import { Route } from "@/Route/Route";
import type { Middleware } from "@/Middleware/Middleware";
import type { RouterAdapterInterface } from "@/Router/RouterAdapterInterface";
import { CorpusAdapter } from "@/Router/adapters/CorpusAdapter";
import { LazyMap } from "@/Store/LazyMap";

export class Router {
	constructor(adapter?: RouterAdapterInterface) {
		this._adapter = adapter ?? new CorpusAdapter();
	}

	private _adapter: RouterAdapterInterface;
	private cache = new WeakMap<HttpRequest, Func<[], Promise<HttpResponse>>>();
	private internFuncMap = new LazyMap<string, Func>();
	// RouteId | "*" -> RouterMiddlewareData
	private middlewares = new LazyMap<string, RouterMiddlewareData>();
	// RouteId -> ModelRegistryData
	private models = new LazyMap<RouteId, RouterModelData>();

	addModel(routeId: RouteId, model: AnyRouteModel): void {
		const entry: RouterModelData = {};
		for (const k of Object.keys(model)) {
			const key = k as keyof RouterModelData;
			const schema = model[key];
			if (!schema) continue;
			const handler = schema["~standard"].validate;
			entry[key] = this.intern(
				handler,
				"model",
				strRemoveWhitespace(JSON.stringify(schema)),
			);
		}
		this.models.set(routeId, entry);
	}

	private findModel(routeId: RouteId): RouterModelData | undefined {
		return this.models.get(routeId);
	}

	addMiddleware(m: Middleware): void {
		const useOn = m.useOn;
		const handler = this.intern(m.handler, "middleware", m.handler.toString());

		if (useOn === "*") {
			this.middlewares.set(
				"*",
				this.compile([this.middlewares.get("*"), handler]),
			);
			return;
		}

		for (const target of Array.isArray(useOn) ? useOn : [useOn]) {
			const routeIds =
				target instanceof Route
					? [target.id]
					: target instanceof ControllerAbstract
						? Array.from(target.routeIds)
						: [];

			for (const routeId of routeIds) {
				this.middlewares.set(
					routeId,
					this.compile([
						this.middlewares.get("*"),
						this.middlewares.get(routeId),
						handler,
					]),
				);
			}
		}
	}

	private findMiddleware(routeId: RouteId): RouterMiddlewareData | undefined {
		return this.middlewares.get(routeId);
	}

	addRoute(r: AnyRoute): void {
		const handler = this.intern(r.handler, "route", r.id);
		this._adapter.add({
			id: r.id,
			endpoint: r.endpoint,
			method: r.method,
			handler,
			pattern: r.pattern,
		});
	}

	findRouteHandler(req: HttpRequest): Func<[], Promise<HttpResponse>> {
		const cached = this.cache.get(req);
		if (cached) return cached;

		const result = this._adapter.find(req.method, req.urlObject.pathname);
		if (!result) throw HttpError.notFound();

		const route = result.route;
		const ctx = Context.makeFromRequest(req);
		const middleware = this.findMiddleware(route.id);
		const model = this.findModel(route.id);

		const handler = async () => {
			await middleware?.(ctx);
			await Context.appendParsedData(ctx, req, route.endpoint, model);
			const result = await route.handler(ctx);
			return result instanceof HttpResponse
				? result
				: new HttpResponse(result, {
						cookies: ctx.res.cookies,
						headers: ctx.res.headers,
						status: ctx.res.status,
						statusText: ctx.res.statusText,
					});
		};

		this.cache.set(req, handler);
		return handler;
	}

	getRouteList(): Array<[string, string]> {
		return this._adapter.list();
	}

	private compile<F extends Func>(
		fns: (F | undefined)[],
	): Func<Parameters<F>, Promise<void>> {
		return async (...args: Parameters<F>) => {
			for (const fn of fns) {
				if (!fn) continue;
				// oxlint-disable-next-line typescript/await-thenable
				await fn(...args);
			}
		};
	}

	private intern<T extends Func>(value: T, ...namespace: string[]): T {
		const key = namespace.join("::");
		const existing = this.internFuncMap.get(key);
		if (existing) return existing as T;
		this.internFuncMap.set(key, value);
		return value;
	}
}
