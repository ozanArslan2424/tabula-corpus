import type { __Coreum_HeadersInit } from "@/lib/Headers/__Coreum_HeadersInit";
import type { __Coreum_Method } from "@/lib/Method/__Coreum_Method";

export type __Coreum_RequestInit = Omit<RequestInit, "headers" | "method"> & {
	headers?: __Coreum_HeadersInit;
	method: __Coreum_Method;
};
