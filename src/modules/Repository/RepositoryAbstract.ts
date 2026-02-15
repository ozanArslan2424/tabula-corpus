import type { RepositoryInterface } from "@/modules/Repository/RepositoryInterface";
import type { DatabaseClientInterface } from "@/types";

export abstract class RepositoryAbstract implements RepositoryInterface {
	constructor(readonly db: DatabaseClientInterface) {}
}
