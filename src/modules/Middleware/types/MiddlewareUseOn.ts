import type { ControllerInterface } from "@/modules/Controller/ControllerInterface";
import type { AnyRoute } from "@/modules/Route/types/AnyRoute";

export type MiddlewareUseOn =
	| Array<AnyRoute | ControllerInterface>
	| AnyRoute
	| ControllerInterface
	| "*";
