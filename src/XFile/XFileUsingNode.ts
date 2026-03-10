import { XFileAbstract } from "@/XFile/XFileAbstract";
import type { XFileInterface } from "@/XFile/XFileInterface";
import fs from "node:fs";

export class XFileUsingNode extends XFileAbstract implements XFileInterface {
	async exists(): Promise<boolean> {
		return fs.existsSync(this.path);
	}

	async text(): Promise<string> {
		return fs.readFileSync(this.path, "utf-8");
	}

	stream(): ReadableStream {
		const nodeStream = fs.createReadStream(this.path);
		const encoder = new TextEncoder();
		return new ReadableStream({
			start(controller) {
				nodeStream.on("data", (chunk) => {
					controller.enqueue(
						typeof chunk === "string"
							? encoder.encode(chunk)
							: new Uint8Array(chunk),
					);
				});
				nodeStream.on("end", () => controller.close());
				nodeStream.on("error", (err) => controller.error(err));
			},
			cancel() {
				nodeStream.destroy();
			},
		});
	}
}
