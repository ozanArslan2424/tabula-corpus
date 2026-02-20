import { joinPathSegments } from "@/utils/joinPathSegments";
import { TEST_PORT } from "../utils/TEST_PORT";
import { getRouterInstance } from "@/modules/Router/RouterInstance";

export const req = (path: string, init?: RequestInit) =>
	new Request(
		`http://localhost:${TEST_PORT}${joinPathSegments(getRouterInstance().globalPrefix, path)}`,
		init,
	);
