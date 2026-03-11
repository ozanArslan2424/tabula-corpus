import type { RateLimitEntry } from "@/XRateLimiter/types/RateLimitEntry";

// Storage interface for pluggable backends
export interface RateLimitStoreInterface {
	get(id: string): Promise<RateLimitEntry | undefined>;
	set(id: string, entry: RateLimitEntry): Promise<void>;
	delete(id: string): Promise<void>;
	cleanup(now: number): Promise<void>;
	clear(): Promise<void>;
	size(): Promise<number>;
}
