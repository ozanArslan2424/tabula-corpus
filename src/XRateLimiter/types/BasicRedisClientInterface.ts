import type { Func } from "@/utils/types/Func";

export interface BasicRedisClientInterface {
	get: Func<[string], Promise<string>>;
	set: Func<[string, string, string, number], Promise<void>>;
	del: Func<string[], Promise<void>>;
	keys: Func<[string], Promise<string[]>>;
}
