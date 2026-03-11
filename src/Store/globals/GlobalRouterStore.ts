import type { Router } from "@/Router/Router";
import { StoreAbstract } from "@/Store/StoreAbstract";
import { internalLogger } from "@/utils/internalLogger";

export class GlobalRouterStore extends StoreAbstract<Router | null> {
	value: Router | null = null;

	override get(): Router {
		if (!this.value) {
			internalLogger.error(
				"Router instance is not set. Please instantiate your Server before your routes.",
			);
			process.exit(1);
		}
		return this.value;
	}
}
