import { GlobalPrefixStore } from "@/Store/globals/GlobalPrefixStore";
import { GlobalRouterStore } from "@/Store/globals/GlobalRouterStore";
import { GlobalCorsStore } from "@/Store/globals/GlobalCorsStore.js";
import * as C from "@/C";
import * as X from "@/X";

export const _prefixStore = new GlobalPrefixStore();
export const _routerStore = new GlobalRouterStore();
export const _corsStore = new GlobalCorsStore();

export type * from "./types.d.ts";

export * from "@/C";
export * from "@/X";

export { C, C as default, X, X as Extra };
