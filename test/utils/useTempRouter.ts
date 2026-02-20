import { Router } from "@/modules/Router/Router";
import {
	getRouterInstance,
	setRouterInstance,
} from "@/modules/Router/RouterInstance";

export async function useTempRouter(cb: () => Promise<void>) {
	const originalRouter = getRouterInstance();
	const newRouter = new Router();
	newRouter.setGlobalPrefix(originalRouter.globalPrefix);
	setRouterInstance(newRouter);
	await cb();
	setRouterInstance(originalRouter);
}
