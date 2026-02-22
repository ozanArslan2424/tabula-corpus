import type { FileWalkerInterface } from "@/modules/FileWalker/FileWalkerInterface";
import type { FileWalkerFile } from "@/modules/FileWalker/types/FileWalkerFile";
import fs from "fs";
import path from "path";

export class FileWalkerUsingNode implements FileWalkerInterface {
	async exists(address: string): Promise<boolean> {
		return fs.existsSync(address);
	}

	async find(address: string): Promise<FileWalkerFile | null> {
		try {
			const exists = this.exists(address);
			if (!exists) return null;
			return {
				text: async () => fs.readFileSync(address, "utf-8"),
			};
		} catch {
			return null;
		}
	}

	getExtension(address: string): string {
		return path.extname(address).toLowerCase().replace(".", "");
	}

	/** address must be resolved file path */
	async read(address: string): Promise<string | null> {
		try {
			const file = await this.find(address);
			if (!file) return null;
			return await file.text();
		} catch {
			return null;
		}
	}
}
