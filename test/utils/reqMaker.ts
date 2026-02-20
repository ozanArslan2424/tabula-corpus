import { joinPathSegments } from "@/utils/joinPathSegments";
import { getRouterInstance } from "@/modules/Router/RouterInstance";
import { TEST_URL } from "./TEST_URL";

export function reqMaker(prefix: string) {
	return (
		path: string,
		init?: RequestInit & {
			search?: Record<string, string | number | boolean>;
		},
	) => {
		const url = new URL(
			`${TEST_URL}${joinPathSegments(getRouterInstance().globalPrefix, prefix, path)}`,
		);
		if (init?.search) {
			for (const [key, value] of Object.entries(init.search)) {
				url.searchParams.append(key, value.toString());
			}
		}
		return new Request(url, init);
	};
}
