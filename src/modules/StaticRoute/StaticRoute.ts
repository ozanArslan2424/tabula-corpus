import { FileWalker } from "@/modules/FileWalker/FileWalker";
import { HttpError } from "@/modules/HttpError/HttpError";
import type { Method } from "@/modules/HttpRequest/enums/Method";
import { Status } from "@/modules/HttpResponse/enums/Status";
import { HttpResponse } from "@/modules/HttpResponse/HttpResponse";
import { RouteVariant } from "@/modules/Route/enums/RouteVariant";
import type { RouteId } from "@/modules/Route/types/RouteId";
import { Router } from "@/modules/Router/Router";
import { CSS } from "@/modules/StaticRoute/utils/CSS";
import { HTML } from "@/modules/StaticRoute/utils/HTML";
import { JS } from "@/modules/StaticRoute/utils/JS";
import { StaticRouteAbstract } from "@/modules/StaticRoute/StaticRouteAbstract";
import type { StaticRouteInterface } from "@/modules/StaticRoute/StaticRouteInterface";
import type { StaticHtmlProps } from "@/modules/StaticRoute/types/StaticHtmlProps";
import type { StaticRouteHandler } from "@/modules/StaticRoute/types/StaticRouteHandler";
import type { StaticRouteOptions } from "@/modules/StaticRoute/types/StaticRouteOptions";
import type { StaticScriptProps } from "@/modules/StaticRoute/types/StaticScriptProps";
import type { StaticStyleProps } from "@/modules/StaticRoute/types/StaticStyleProps";

export class StaticRoute<Path extends string = string>
	extends StaticRouteAbstract<Path>
	implements StaticRouteInterface<Path>
{
	constructor(private readonly opts: StaticRouteOptions<Path>) {
		super();
		this.variant = RouteVariant.static;
		this.endpoint = this.resolveEndpoint(opts.props.path, this.variant);
		this.method = this.resolveMethod(opts.props.path);
		this.pattern = this.resolvePattern(this.endpoint);
		this.id = this.resolveId(this.method, this.endpoint);
		Router.addRoute(this);
	}

	id: RouteId;
	variant: RouteVariant;
	method: Method;
	endpoint: Path;
	pattern: RegExp;
	handler: StaticRouteHandler = async () => {
		switch (this.opts.extension) {
			case "html":
				return await this.handleHtml(this.opts.props);
			case "js":
				return await this.handleJs(this.opts.props);
			case "css":
				return await this.handleCss(this.opts.props);
		}
	};

	private async handleCss(props: StaticStyleProps) {
		if (props.variant === "raw") {
			return this.toResponse(CSS.build(props.rules));
		}

		if (props.variant === "file") {
			const content = await FileWalker.read(props.filePath);
			if (!content) {
				// No need to throw for missing styles
				console.error("File not found at:", props.filePath);
				return this.toResponse("");
			}
			return this.toResponse(content);
		}

		throw new Error(
			"Unavailable variant for CSS route:",
			(props as any).variant,
		);
	}

	private async handleJs(props: StaticScriptProps) {
		const content = await FileWalker.read(props.filePath);

		if (!content) {
			// No need to throw for missing javascript
			console.error("File not found at:", props.filePath);
			return this.toResponse("");
		}

		if (props.variant === "js") {
			const minified = await JS.minify(content);
			return this.toResponse(minified);
		}

		if (props.variant === "ts") {
			const fileName = props.filePath.split("/").pop() ?? "unknown.ts";
			const transpiled = await JS.transpile(fileName, content);
			const minified = await JS.minify(transpiled);
			return this.toResponse(minified);
		}

		throw new Error(
			"Unavailable variant for JS route:",
			(props as any).variant,
		);
	}

	private async handleHtml(props: StaticHtmlProps) {
		if (props.variant === "raw") {
			return this.toResponse(HTML.build(props.skeleton));
		}

		if (props.variant === "file") {
			const content = await FileWalker.read(props.filePath);
			if (!content) {
				// No HTML file means 404
				console.error("File not found at:", props.filePath);
				throw HttpError.notFound();
			}
			return this.toResponse(content);
		}

		throw new Error(
			"Unavailable variant for HTML route:",
			(props as any).variant,
		);
	}

	private toResponse(content: string) {
		const contentType = this.getContentType(this.opts.extension);
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

	private getContentType(extension: string): string {
		return this.mimeTypes[extension] || "application/octet-stream";
	}
}
