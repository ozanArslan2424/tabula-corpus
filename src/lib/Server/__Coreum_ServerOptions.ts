import type { __Coreum_Controller } from "@/lib/Controller/__Coreum_Controller";
import type { __Coreum_Cors } from "@/lib/Cors/__Coreum_Cors";
import type { __Coreum_DBClientInterface } from "@/lib/DBClient/__Coreum_DBClientInterface";
import type { __Coreum_OnlyBun_HTMLBundle } from "@/lib/HTMLBundle/__Coreum_OnlyBun_HTMLBundle";
import type { __Coreum_Middleware } from "@/lib/Middleware/__Coreum_Middleware";
import type { __Coreum_Route } from "@/lib/Route/__Coreum_Route";
import type { __Coreum_ErrorCallback } from "@/lib/Server/__Coreum_ErrorCallback";
import type { __Coreum_FetchCallback } from "@/lib/Server/__Coreum_FetchCallback";

export type __Coreum_ServerOptions = {
	db?: __Coreum_DBClientInterface;
	controllers: __Coreum_Controller[];
	middlewares?: __Coreum_Middleware<any>[];
	floatingRoutes?: __Coreum_Route<any, any, any, any, any>[];
	staticPages?: Record<string, __Coreum_OnlyBun_HTMLBundle>;
	cors?: __Coreum_Cors;
	onError?: __Coreum_ErrorCallback;
	onNotFound?: __Coreum_FetchCallback;
	onMethodNotAllowed?: __Coreum_FetchCallback;
};
