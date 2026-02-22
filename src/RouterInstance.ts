import type { RouterInterface } from "@/modules/Router/RouterInterface";

let RouterInstance: RouterInterface;

export function getRouterInstance(): RouterInterface {
	if (!RouterInstance) {
		console.error(
			"Router instance is not set. Please instantiate your Server before your routes.",
		);
		process.exit(1);
	}
	return RouterInstance;
}

export function setRouterInstance(router: RouterInterface): void {
	RouterInstance = router;
}
