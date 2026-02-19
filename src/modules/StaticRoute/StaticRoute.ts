import { FileWalker } from "@/modules/FileWalker/FileWalker";
import { HttpError } from "@/modules/HttpError/HttpError";
import { Method } from "@/modules/HttpRequest/enums/Method";
import { Status } from "@/modules/HttpResponse/enums/Status";
import { HttpResponse } from "@/modules/HttpResponse/HttpResponse";
import { RouteVariant } from "@/modules/Route/enums/RouteVariant";
import type { RouteId } from "@/modules/Route/types/RouteId";
import { Router } from "@/modules/Router/Router";
import { CSS } from "@/modules/Builders/utils/CSS";
import { JS } from "@/modules/Builders/utils/JS";
import { StaticRouteAbstract } from "@/modules/StaticRoute/StaticRouteAbstract";
import type { StaticRouteInterface } from "@/modules/StaticRoute/StaticRouteInterface";
import type { StaticRouteHandler } from "@/modules/StaticRoute/types/StaticRouteHandler";
import type { OrString } from "@/utils/OrString";

export class StaticRoute<Path extends string = string>
	extends StaticRouteAbstract<Path>
	implements StaticRouteInterface<Path>
{
	constructor(
		path: Path,
		private filePath: string,
		extension?: OrString<"html" | "css" | "js" | "ts">,
	) {
		super();
		this.variant = RouteVariant.static;
		this.method = Method.GET;
		this.endpoint = this.resolveEndpoint(path, this.variant);
		this.pattern = this.resolvePattern(this.endpoint);
		this.id = this.resolveId(this.method, this.endpoint);

		this.extension = extension || this.filePath.split(".").pop() || "txt";
		Router.addRoute(this);
	}

	extension: string;

	id: RouteId;
	variant: RouteVariant;
	method: Method;
	endpoint: Path;
	pattern: RegExp;
	handler: StaticRouteHandler = async () => {
		switch (this.extension) {
			case "html":
				return await this.handleHtml();
			case "css":
				return await this.handleCss();
			case "js":
				return await this.handleJs();
			case "ts":
				return await this.handleTs();
			default:
				return await this.handleFile();
		}
	};

	private async handleHtml() {
		const content = await this.getContent();
		return this.toResponse(content);
	}

	private async handleCss() {
		const content = await this.getContent();
		const minified = await CSS.minify(content);
		return this.toResponse(minified);
	}

	private async handleJs() {
		const content = await this.getContent();
		const minified = await JS.minify(content);
		return this.toResponse(minified);
	}

	private async handleTs() {
		const content = await this.getContent();
		const fileName = this.getFileName();
		const transpiled = await JS.transpile(fileName, content);
		const minified = await JS.minify(transpiled);
		return this.toResponse(minified);
	}

	// TODO: Compress images and other binary files
	private async handleFile() {
		const content = await this.getContent();
		return this.toResponse(content);
	}

	private getFileName(): string {
		return this.filePath.split("/").pop() ?? "unknown.ts";
	}

	private async getContent(): Promise<string> {
		const content = await FileWalker.read(this.filePath);
		if (!content) {
			console.error("File not found at:", this.filePath);
			throw HttpError.notFound();
		}
		return content;
	}

	private toResponse(content: string) {
		const contentType =
			this.mimeTypes[this.extension] || "application/octet-stream";
		const contentLength = content.length.toString();
		return new HttpResponse(content, {
			status: Status.OK,
			headers: {
				"Content-Type": contentType,
				"Content-Length": contentLength,
			},
		});
	}

	private mimeTypes: Record<string, string> = {
		html: "text/html",
		htm: "text/html",
		css: "text/css",
		js: "application/javascript",
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
}
