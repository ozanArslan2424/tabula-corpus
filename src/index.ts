import { GlobalPrefixStore } from "@/Store/globals/GlobalPrefixStore";
import { GlobalRouterStore } from "@/Store/globals/GlobalRouterStore";

export const _globalPrefix = new GlobalPrefixStore();
export const _router = new GlobalRouterStore();

import * as C from "@/exports";

export * from "@/exports";
export * from "./Router/adapters/MemoiristAdapter";

export { C };

export default C;
