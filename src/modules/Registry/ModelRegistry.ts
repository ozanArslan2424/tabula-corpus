import type { AnyRouteModel } from "@/modules/Parser/types/AnyRouteModel";
import type { ModelRegistryData } from "@/modules/Registry/types/ModelRegistryData";
import type { RouteId } from "@/modules/Route/types/RouteId";

export class ModelRegistry {
	readonly data: Record<RouteId, ModelRegistryData> = {};

	add(routeId: RouteId, model: AnyRouteModel): void {
		const entry: ModelRegistryData = {};

		for (const [k, v] of Object.entries(model)) {
			const keys = ["body", "search", "params", "response"];
			if (!keys.includes(k)) {
				continue;
			}

			entry[k as keyof ModelRegistryData] = {
				validate: v["~standard"].validate,
				vendor: v["~standard"].vendor,
			};
		}

		this.data[routeId] = entry;
	}

	find(routeId: RouteId): ModelRegistryData | undefined {
		return this.data[routeId];
	}
}
