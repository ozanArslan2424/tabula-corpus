import type { FileWalkerInterface } from "@/modules/FileWalker/FileWalkerInterface";
import type { FileWalkerFile } from "@/modules/FileWalker/types/FileWalkerFile";

export class FileWalkerUsingBun implements FileWalkerInterface {
	async find(address: string): Promise<FileWalkerFile | null> {
		const file = Bun.file(address);
		const exists = await file.exists();
		if (exists) {
			return { text: () => file.text() };
		}
		return null;
	}

	async exists(address: string): Promise<boolean> {
		return (await this.find(address)) !== null;
	}

	getExtension(address: string): string {
		return address.split(".").pop() ?? "txt";
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
