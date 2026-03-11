import type { Controller } from "@/Controller/Controller";
import type { AnyRoute } from "../../Route/types/AnyRoute";

export type MiddlewareUseOn =
	| Array<AnyRoute | Controller>
	| AnyRoute
	| Controller
	| "*";
