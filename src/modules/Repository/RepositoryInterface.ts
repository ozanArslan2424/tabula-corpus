import type { DatabaseClientInterface } from "@/types";

export interface RepositoryInterface {
	readonly db: DatabaseClientInterface;
}
