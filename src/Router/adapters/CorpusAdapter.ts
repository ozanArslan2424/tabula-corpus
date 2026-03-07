import type { RouterAdapterInterface } from "@/Router/RouterAdapterInterface";
import type { RouterRouteData } from "@/Router/types/RouterRouteData";
import { HttpError } from "@/Error/HttpError";
import { isRegexMatch } from "@/utils/isRegexMatch";
import { strIsEqual } from "@/utils/strIsEqual";
import type { RouteId } from "@/Route/types/RouteId";

export class CorpusAdapter implements RouterAdapterInterface {
	// RouteId -> RouteRegistryData
	private routes = new Map<RouteId, RouterRouteData>();

	add(data: RouterRouteData): void {
		this.checkPossibleCollision(data);
		this.routes.set(data.id, data);
	}

	find(
		method: string,
		path: string,
	): { route: RouterRouteData; params?: Record<string, unknown> } | null {
		let route: RouterRouteData | null = null;

		for (const data of this.routes.values()) {
			const endpoint = data.endpoint;

			// Check for pattern match for parameterized routes
			if (this.hasAnyParam(endpoint) && isRegexMatch(path, data.pattern)) {
				route = data;
				break;
			}

			// If pattern doesn't match check for missing last part param
			if (
				this.hasLastPartParam(endpoint) &&
				strIsEqual(this.removeLastParam(endpoint), path, "lower")
			) {
				route = data;
				break;
			}

			// Check for simple pathname match for static routes
			if (strIsEqual(endpoint, path)) {
				// Found exact match
				route = data;
				break;
			}
		}

		if (route === null) {
			throw HttpError.notFound();
		}

		// The endpoint exists but the method is not allowed
		if (!strIsEqual(method, route.method, "upper")) {
			throw HttpError.methodNotAllowed();
		}

		return { route };
	}

	list(): Array<[string, string]> {
		return Array.from(this.routes.values()).map((r) => [r.method, r.endpoint]);
	}

	private checkPossibleCollision(data: RouterRouteData) {
		const existing = this.routes.get(data.id);
		if (existing) {
			console.error(
				`⚠️  Collision: ${data.method} ${data.endpoint} clashes with ${existing.method} ${existing.endpoint}`,
			);
		}

		for (const route of this.routes.values()) {
			// Different methods can't clash
			if (route.method !== data.method) continue;

			if (this.hasAnyParam(data.endpoint)) {
				// Has params, pattern shouldn't match existing
				if (isRegexMatch(data.endpoint, route.pattern)) {
					console.error(
						`⚠️  Collision: ${data.method} ${data.endpoint} clashes with ${route.method} ${route.endpoint}`,
					);
				}

				// Param route vs static route with same base
				if (!this.hasAnyParam(route.endpoint)) {
					if (
						strIsEqual(
							this.removeLastParam(data.endpoint),
							route.endpoint,
							"lower",
						)
					) {
						console.error(
							`⚠️  Param route ${data.method} ${data.endpoint} may conflict with static ${route.method} ${route.endpoint}`,
						);
					}
				}
			} else {
				// No params, endpoint string shouldn't already exist
				if (strIsEqual(data.endpoint, route.endpoint, "lower")) {
					console.error(
						`⚠️  Collision: ${data.method} ${data.endpoint} already exists`,
					);
				}

				// No params but existing has last part param
				if (this.hasLastPartParam(route.endpoint)) {
					if (
						strIsEqual(
							this.removeLastParam(data.endpoint),
							this.removeLastParam(route.endpoint),
							"lower",
						)
					) {
						console.error(
							`⚠️  Static route ${data.method} ${data.endpoint} may be shadowed by param route ${route.method} ${route.endpoint}`,
						);
					}
				}
			}
		}
	}

	private hasLastPartParam(endpoint: string): boolean {
		if (!this.hasAnyParam(endpoint)) return false;
		const parts = endpoint.split("/");
		return parts[parts.length - 1]?.startsWith(":") ?? false;
	}

	private removeLastParam(endpoint: string): string {
		return endpoint.split("/").slice(0, -1).join("/");
	}

	private hasAnyParam(endpoint: string): boolean {
		return endpoint.includes(":");
	}
}
