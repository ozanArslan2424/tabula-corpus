import { __Coreum_RuntimeOptions } from "@/lib/runtime/__Coreum_RuntimeOptions";

export function __Coreum_getRuntime() {
	if (typeof Bun !== "undefined") return __Coreum_RuntimeOptions.bun;
	return __Coreum_RuntimeOptions.node;
}
