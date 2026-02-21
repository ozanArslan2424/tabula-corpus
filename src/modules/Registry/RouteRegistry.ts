import type { HttpRequestInterface } from "@/modules/HttpRequest/HttpRequestInterface";
import type { RouteRegistryData } from "@/modules/Registry/types/RouteRegistryData";
import type { RouteId } from "@/modules/Route/types/RouteId";
import { HttpError } from "@/modules/HttpError/HttpError";
import type { HttpErrorInterface } from "@/modules/HttpError/HttpErrorInterface";
import { Route } from "@/modules/Route/Route";
import { joinPathSegments } from "@/utils/joinPathSegments";
import { patternIsEqual } from "@/utils/patternIsEqual";
import { textIsDefined } from "@/utils/textIsDefined";
import { textIsEqual } from "@/utils/textIsEqual";
import { textSplit } from "@/utils/textSplit";
import type { AnyRoute } from "@/modules/Route/types/AnyRoute";

export class RouteRegistry {
	private readonly possibles: string[] = [];
	readonly data: Record<RouteId, RouteRegistryData> = {};

	add(route: AnyRoute): void {
		this.checkPossibleCollision(route.endpoint, route.method);
		this.addPossibleCollision(route.endpoint);
		this.data[route.id] = {
			id: route.id,
			pattern: route.pattern,
			method: route.method,
			endpoint: route.endpoint,
			handler: route.handler,
		};
	}

	find(req: HttpRequestInterface): RouteRegistryData {
		const route = this.findRouteByPathname(
			new URL(req.url).pathname,
			req.method.toUpperCase(),
		);

		if (route instanceof Error) {
			throw route;
		}

		return route;
	}

	private addPossibleCollision(routePath: string) {
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

	private checkPossibleCollision(routePath: string, method: string) {
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

	private pathsCollide(path1: string, path2: string): boolean {
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

	private findRouteByPathname(
		pathname: string,
		method: string,
	): RouteRegistryData | HttpErrorInterface {
		const possibleId: RouteId = `[${method}]:[${pathname}]`;
		let route: RouteRegistryData | undefined;

		if (this.data[possibleId]) {
			route = this.data[possibleId];
		} else {
			route = Object.values(this.data).find((r) => {
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
