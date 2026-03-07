import Memoirist from "memoirist";
import type { RouterAdapterInterface } from "@/Router/RouterAdapterInterface";
import type { RouterRouteData } from "@/Router/types/RouterRouteData";

export class MemoiristAdapter implements RouterAdapterInterface {
	private router = new Memoirist<RouterRouteData>();

	add(data: RouterRouteData): void {
		this.router.add(data.method, data.endpoint, data);
	}

	find(
		method: string,
		path: string,
	): { route: RouterRouteData; params?: Record<string, unknown> } | null {
		const result = this.router.find(method, path);
		if (!result) return null;
		return { route: result.store, params: result.params };
	}

	list(): Array<[string, string]> {
		return this.router.history.map(([method, path]) => [method, path]);
	}
}
