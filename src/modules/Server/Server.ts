import type { ServerInterface } from "@/modules/Server/ServerInterface";
import { ServerAbstract } from "@/modules/Server/ServerAbstract";
import { RuntimeOptions } from "@/modules/Runtime/enums/RuntimeOptions";
import { ServerUsingBun } from "@/modules/Server/variants/ServerUsingBun";
import { ServerUsingNode } from "@/modules/Server/variants/ServerUsingNode";
import type { ServeOptions } from "@/modules/Server/types/ServeOptions";
import { getRuntime } from "@/modules/Runtime/getRuntime";

/**
 * Server is the entrypoint to the app. It must be initialized before registering routes and middlewares.
 * ".listen()" to start listening.
 */

export class Server extends ServerAbstract implements ServerInterface {
	constructor() {
		super();
		this.instance = this.getInstance();
	}

	serve(options: ServeOptions): void {
		return this.instance.serve(options);
	}

	async exit(): Promise<void> {
		await this.handleBeforeExit?.();
		return await this.instance.exit();
	}

	private instance: ServerInterface;

	private getInstance(): ServerInterface {
		const runtime = getRuntime();

		switch (runtime) {
			case RuntimeOptions.bun:
				return new ServerUsingBun();
			case RuntimeOptions.node:
				return new ServerUsingNode();
			default:
				throw new Error(`Unsupported runtime: ${runtime as string}`);
		}
	}
}
