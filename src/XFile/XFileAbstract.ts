import type { XFileInterface } from "@/XFile/XFileInterface";

export abstract class XFileAbstract implements XFileInterface {
	constructor(
		readonly path: string,
		private readonly fallbackExtension?: string,
	) {}

	abstract text(): Promise<string>;
	abstract stream(): ReadableStream;
	abstract exists(): Promise<boolean>;

	get name(): string {
		return this.path.split("/").pop() ?? this.path;
	}

	get extension(): string {
		return this.path.split(".").pop() ?? this.fallbackExtension ?? "txt";
	}

	get mimeType(): string {
		const mimeTypes: Record<string, string> = {
			html: "text/html",
			htm: "text/html",
			css: "text/css",
			js: "application/javascript",
			ts: "application/javascript",
			mjs: "application/javascript",
			json: "application/json",
			png: "image/png",
			jpg: "image/jpeg",
			jpeg: "image/jpeg",
			gif: "image/gif",
			svg: "image/svg+xml",
			ico: "image/x-icon",
			txt: "text/plain",
			xml: "application/xml",
			pdf: "application/pdf",
			zip: "application/zip",
			mp3: "audio/mpeg",
			mp4: "video/mp4",
			webm: "video/webm",
			woff: "font/woff",
			woff2: "font/woff2",
			ttf: "font/ttf",
		};

		return mimeTypes[this.extension] ?? "application/octet-stream";
	}
}
