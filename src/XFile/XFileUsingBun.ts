import { XFileAbstract } from "@/XFile/XFileAbstract";
import type { XFileInterface } from "@/XFile/XFileInterface";

export class XFileUsingBun extends XFileAbstract implements XFileInterface {
	constructor(...args: ConstructorParameters<typeof XFileAbstract>) {
		super(...args);
		this.file = Bun.file(args[0]);
	}

	file: Bun.BunFile;

	async exists(): Promise<boolean> {
		return await this.file.exists();
	}

	async text(): Promise<string> {
		return await this.file.text();
	}

	stream(): ReadableStream {
		return this.file.stream();
	}
}
