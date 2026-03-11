import type { DatabaseClientInterface } from "@/types.d.ts";

/** Abstract class for repository implementations */
export abstract class XRepository {
	constructor(readonly db: DatabaseClientInterface) {}
}
