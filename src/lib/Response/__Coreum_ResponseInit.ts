import type { __Coreum_Cookies } from "@/lib/Cookies/__Coreum_Cookies";
import type { __Coreum_Headers } from "@/lib/Headers/__Coreum_Headers";
import type { __Coreum_Status } from "@/lib/Status/__Coreum_Status";

export type __Coreum_ResponseInit = {
	cookies?: __Coreum_Cookies;
	headers?: HeadersInit | __Coreum_Headers;
	status?: __Coreum_Status;
	statusText?: string;
};
