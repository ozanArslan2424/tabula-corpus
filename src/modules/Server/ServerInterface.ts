import type { CorsOptions } from "@/modules/Cors/types/CorsOptions";
import type { HttpResponseInterface } from "@/modules/HttpResponse/HttpResponseInterface";
import type { ErrorHandler } from "@/modules/Server/types/ErrorHandler";
import type { RequestHandler } from "@/modules/Server/types/RequestHandler";
import type { ServeOptions } from "@/modules/Server/types/ServeOptions";
import type { MaybePromise } from "@/types/MaybePromise";

export interface ServerInterface {
	serve(options: ServeOptions): void;
	listen(
		port: ServeOptions["port"],
		hostname: ServeOptions["hostname"],
	): Promise<void>;
	exit(): Promise<void>;
	handle(request: Request): Promise<Response>;
	setGlobalPrefix(value: string): void;
	setCors(cors: CorsOptions): void;
	setOnError(handler: ErrorHandler): void;
	setOnNotFound(handler: RequestHandler): void;
	setOnBeforeListen(handler: () => MaybePromise<void>): void;
	setOnBeforeExit(handler: () => MaybePromise<void>): void;
	setOnAfterResponse(
		handler: (
			res: HttpResponseInterface,
		) => MaybePromise<HttpResponseInterface>,
	): void;
}
