import type { Cors } from "@/Cors";
import { StoreAbstract } from "@/Store/StoreAbstract";

export class GlobalCorsStore extends StoreAbstract<Cors | null> {
	protected value: Cors | null = null;
}
