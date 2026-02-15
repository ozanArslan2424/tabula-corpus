import "@/types.d.ts";

declare module "@/types.d.ts" {
	interface ContextDataInterface {
		hello?: string;
		ozan?: string | undefined;
		array?: unknown[];
	}
}
