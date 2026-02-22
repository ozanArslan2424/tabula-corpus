import type { RepositoryInterface } from "@/modules/Repository/RepositoryInterface";
import type { DatabaseClientInterface } from "@/types";

/** Abstract class for repository implementations */
export abstract class RepositoryAbstract implements RepositoryInterface {
	constructor(readonly db: DatabaseClientInterface) {}
}
