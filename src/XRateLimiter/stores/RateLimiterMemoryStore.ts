import type { RateLimitStoreInterface } from "@/XRateLimiter/stores/RateLimitStoreInterface";
import type { RateLimitEntry } from "@/XRateLimiter/types/RateLimitEntry";

export class RateLimiterMemoryStore implements RateLimitStoreInterface {
	private store = new Map<string, RateLimitEntry>();
	private locks = new Map<string, Promise<void>>();

	async get(id: string): Promise<RateLimitEntry | undefined> {
		return this.store.get(id);
	}

	async set(id: string, entry: RateLimitEntry): Promise<void> {
		while (this.locks.has(id)) {
			await this.locks.get(id);
		}

		let resolveLock: () => void;
		this.locks.set(
			id,
			new Promise((resolve) => {
				resolveLock = resolve;
			}),
		);

		try {
			this.store.set(id, entry);
		} finally {
			this.locks.delete(id);
			resolveLock!();
		}
	}

	async delete(id: string): Promise<void> {
		this.store.delete(id);
	}

	async cleanup(now: number): Promise<void> {
		for (const [id, entry] of this.store) {
			if (entry.resetAt <= now) {
				await this.delete(id);
			}
		}
	}

	async clear(): Promise<void> {
		this.store.clear();
	}

	async size(): Promise<number> {
		return this.store.size;
	}
}
