import type { RouteId } from "@/modules/Route/types/RouteId";
import type { RegisteredModelData } from "@/modules/Router/types/RegisteredModelData";

export class RouterModelRegistry {
	readonly models: Record<RouteId, RegisteredModelData> = {};

	addModel(routeId: RouteId, model?: RegisteredModelData) {
		if (model) {
			this.models[routeId] = model;
		}
	}

	findModel(routeId: RouteId) {
		return this.models[routeId];
	}
}
