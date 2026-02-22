import { getRuntime } from "@/modules/Runtime/getRuntime";
import { RuntimeOptions } from "@/modules/Runtime/enums/RuntimeOptions";
import type { FileWalkerInterface } from "@/modules/FileWalker/FileWalkerInterface";
import { FileWalkerUsingBun } from "@/modules/FileWalker/variants/FileWalkerUsingBun";
import { FileWalkerUsingNode } from "@/modules/FileWalker/variants/FileWalkerUsingNode";
import type { FileWalkerFile } from "@/modules/FileWalker/types/FileWalkerFile";

export class FileWalker {
	private static get instance(): FileWalkerInterface {
		const runtime = getRuntime();

		switch (runtime) {
			case RuntimeOptions.bun:
				return new FileWalkerUsingBun();
			case RuntimeOptions.node:
				return new FileWalkerUsingNode();
			default:
				throw new Error(`Unsupported runtime: ${runtime}`);
		}
	}

	static read(address: string): Promise<string | null> {
		return this.instance.read(address);
	}

	static exists(address: string): Promise<boolean> {
		return this.instance.exists(address);
	}

	static getExtension(address: string): string {
		return this.instance.getExtension(address);
	}

	static find(address: string): Promise<FileWalkerFile | null> {
		return this.instance.find(address);
	}
}
