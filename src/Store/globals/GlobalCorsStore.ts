import type { XCors } from "@/XCors/XCors";
import { StoreAbstract } from "@/Store/StoreAbstract";

export class GlobalCorsStore extends StoreAbstract<XCors | null> {
	protected value: XCors | null = null;
}
