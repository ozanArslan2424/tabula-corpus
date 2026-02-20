import { HttpError } from "@/modules/HttpError/HttpError";
import type { HttpErrorInterface } from "@/modules/HttpError/HttpErrorInterface";
import type { HttpRequestInterface } from "@/modules/HttpRequest/HttpRequestInterface";
import type { RegisteredRouteData } from "@/modules/Router/types/RegisteredRouteData";
import { Route } from "@/modules/Route/Route";
import type { AnyRoute } from "@/modules/Route/types/AnyRoute";
import type { RouteId } from "@/modules/Route/types/RouteId";
import { joinPathSegments } from "@/utils/joinPathSegments";
import { patternIsEqual } from "@/utils/patternIsEqual";
import { textIsDefined } from "@/utils/textIsDefined";
import { textIsEqual } from "@/utils/textIsEqual";
import { textSplit } from "@/utils/textSplit";

export class RouterRouteRegistry {
	readonly possibles: string[] = [];
	readonly routes: Record<RouteId, RegisteredRouteData> = {};

	addRoute(r: AnyRoute) {
		this.checkPossibleCollision(r.endpoint, r.method);
		this.addPossibleCollision(r.endpoint);
		this.routes[r.id] = {
			id: r.id,
			endpoint: r.endpoint,
			method: r.method,
			pattern: r.pattern,
			handler: r.handler,
		};
	}

	findRoute(req: HttpRequestInterface): RegisteredRouteData {
		const pathname = new URL(req.url).pathname;

		const route = this.findRouteByPathname(pathname, req.method.toUpperCase());

		if (route instanceof Error) {
			throw route;
		}
		return route;
	}

	addPossibleCollision(routePath: string) {
		const parts = textSplit("/", routePath);
		if (!this.possibles.includes(routePath)) {
			this.possibles.push(routePath);
		}

		for (let i = 0; i < parts.length; i++) {
			const part = parts[i];
			if (!textIsDefined(part)) continue;
			const variation = [...parts];
			variation[i] = part.startsWith(":") ? part : `:${part}`;
			const possiblePath = joinPathSegments(...variation);
			if (this.possibles.includes(possiblePath)) continue;
			this.possibles.push(possiblePath);
		}
	}

	checkPossibleCollision(routePath: string, method: string) {
		for (const possible of this.possibles) {
			if (possible === routePath) continue;

			const similar = this.findRouteByPathname(possible, method);
			if (!(similar instanceof Route)) continue;
			if (similar.endpoint === routePath) continue;
			if (!this.pathsCollide(routePath, similar.endpoint)) continue;
			console.warn(
				`${similar.endpoint} has params that clash with ${routePath}. Initialize ${routePath} before ${similar.endpoint} or consider using a different endpoint.`,
			);
		}

		const existingRoute = this.findRouteByPathname(routePath, method);
		if (
			existingRoute instanceof Route &&
			existingRoute.endpoint !== routePath
		) {
			console.warn(
				`${routePath} clashes with existing route ${existingRoute.endpoint}. Consider using a different endpoint.`,
			);
		}
	}

	pathsCollide(path1: string, path2: string): boolean {
		const parts1 = textSplit("/", path1);
		const parts2 = textSplit("/", path2);

		if (parts1.length !== parts2.length) return false;

		for (let i = 0; i < parts1.length; i++) {
			const part1 = parts1[i];
			const part2 = parts2[i];
			if (!textIsDefined(part1) || !textIsDefined(part2)) continue;

			if (!part1.startsWith(":") && !part2.startsWith(":") && part1 !== part2) {
				return false;
			}
		}

		return true;
	}

	findRouteByPathname(
		pathname: string,
		method: string,
	): RegisteredRouteData | HttpErrorInterface {
		const possibleId: RouteId = `[${method}]:[${pathname}]`;
		let route: RegisteredRouteData | undefined;

		if (this.routes[possibleId]) {
			route = this.routes[possibleId];
		} else {
			route = Object.values(this.routes).find((r) => {
				// with params
				if (r.endpoint.includes(":")) {
					// pattern match first
					const patternMatch = patternIsEqual(pathname, r.pattern);
					if (patternMatch) return patternMatch;

					// if pattern doesn't match check for missing last part param
					const parts = textSplit("/", r.endpoint);
					if (parts[parts.length - 1]?.startsWith(":")) parts.pop();
					return textIsEqual(joinPathSegments(...parts), pathname, "lower");
				} else {
					// If the route doesn't have params, do a simple equality check
					return textIsEqual(r.endpoint, pathname, "lower");
				}
			});
		}

		if (route == undefined) {
			return HttpError.notFound();
		}

		const methodMatch = textIsEqual(route.method, method, "upper");

		if (!methodMatch) {
			return HttpError.methodNotAllowed();
		}

		return route;
	}
}
