import { Router } from "@/modules/Router/Router";
import {
	getRouterInstance,
	setRouterInstance,
} from "@/modules/Router/RouterInstance";
import type { MaybePromise } from "@/types/MaybePromise";

export async function useTemporaryRouter(cb: () => MaybePromise<void>) {
	const originalRouter = getRouterInstance();
	const newRouter = new Router();
	setRouterInstance(newRouter);

	await cb();

	setRouterInstance(originalRouter);
}
