import type { RateLimitStoreInterface } from "@/XRateLimiter/stores/RateLimitStoreInterface";
import type { BasicRedisClientInterface } from "@/XRateLimiter/types/BasicRedisClientInterface";
import type { RateLimitEntry } from "@/XRateLimiter/types/RateLimitEntry";

// Redis store for distributed deployments
export class RateLimiterRedisStore<
	R extends BasicRedisClientInterface,
> implements RateLimitStoreInterface {
	constructor(
		private readonly redis: R,
		private readonly prefix: string = "rl:",
	) {}

	async get(id: string): Promise<RateLimitEntry | undefined> {
		const data = await this.redis.get(this.prefix + id);
		return data ? JSON.parse(data) : undefined;
	}

	async set(id: string, entry: RateLimitEntry): Promise<void> {
		await this.redis.set(
			this.prefix + id,
			JSON.stringify(entry),
			"PX",
			Math.max(0, entry.resetAt - Date.now()),
		);
	}

	async delete(id: string): Promise<void> {
		await this.redis.del(this.prefix + id);
	}

	async cleanup(_now: number): Promise<void> {
		// Redis handles expiration automatically
		// This is a no-op
	}

	async clear(): Promise<void> {
		const keys = await this.redis.keys(this.prefix + "*");
		if (keys.length > 0) {
			await this.redis.del(...keys);
		}
	}

	async size(): Promise<number> {
		const keys = await this.redis.keys(this.prefix + "*");
		return keys.length;
	}
}
