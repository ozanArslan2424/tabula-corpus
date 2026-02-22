import { CookiesAbstract } from "@/modules/Cookies/CookiesAbstract";
import { RuntimeOptions } from "@/modules/Runtime/enums/RuntimeOptions";
import type { CookiesInterface } from "@/modules/Cookies/CookiesInterface";
import { CookiesUsingBun } from "@/modules/Cookies/variants/CookiesUsingBun";
import { CookiesUsingMap } from "@/modules/Cookies/variants/CookiesUsingMap";
import type { CookieOptions } from "@/modules/Cookies/types/CookieOptions";
import type { CookiesInit } from "@/modules/Cookies/types/CookiesInit";
import { getRuntime } from "@/modules/Runtime/getRuntime";

/** Simple cookie map/jar to collect and manipulate cookies. */

export class Cookies extends CookiesAbstract implements CookiesInterface {
	constructor(init?: CookiesInit) {
		super();

		this.instance = this.getInstance();

		if (init) {
			this.applyInit(init);
		}
	}

	private instance: CookiesInterface;

	private getInstance(): CookiesInterface {
		const runtime = getRuntime();

		switch (runtime) {
			case RuntimeOptions.bun:
				return new CookiesUsingBun();

			case RuntimeOptions.node:
			default:
				return new CookiesUsingMap();
		}
	}

	set(opts: CookieOptions): void {
		return this.instance.set(opts);
	}

	get(name: string): string | null {
		return this.instance.get(name);
	}

	has(name: string): boolean {
		return this.instance.has(name);
	}

	delete(opts: Pick<CookieOptions, "name" | "path" | "domain">): void {
		return this.instance.delete(opts);
	}

	entries(): IterableIterator<[string, string]> {
		return this.instance.entries();
	}

	values(): Array<string> {
		return this.instance.values();
	}

	keys(): Array<string> {
		return this.instance.keys();
	}

	toSetCookieHeaders(): Array<string> {
		return this.instance.toSetCookieHeaders();
	}
}
