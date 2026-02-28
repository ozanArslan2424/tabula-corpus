import { setRouterInstance } from "@/index";
import { Router } from "@/Router/Router";
import { ServerAbstract } from "@/Server/ServerAbstract";
import { ServerUsingBun } from "@/Server/ServerUsingBun";
import type { ServeOptions } from "@/Server/types/ServeOptions";
import { Config } from "@/Config/Config";

/**
 * Server is the entrypoint to the app. It must be initialized before registering routes and middlewares.
 * ".listen()" to start listening.
 */

// TODO: Node support
export class Server extends ServerAbstract {
	private instance = new ServerUsingBun();

	constructor() {
		super();
		setRouterInstance(new Router());
	}

	serve(options: ServeOptions): void {
		return this.instance.serve(options);
	}

	async close(): Promise<void> {
		await this.handleBeforeClose?.();
		console.log("Closing...");
		await this.instance.close();
		if (Config.nodeEnv !== "test") {
			process.exit(0);
		}
	}
}
