import type { __Coreum_MiddlewareCallback } from "@/lib/Middleware/__Coreum_MiddlewareCallback";

export type __Coreum_MiddlewareProvider<D = void> = {
	middleware: __Coreum_MiddlewareCallback<D>;
};
