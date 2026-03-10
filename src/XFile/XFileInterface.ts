export interface XFileInterface {
	get name(): string;
	get extension(): string;
	get mimeType(): string;
	exists(): Promise<boolean>;
	text(): Promise<string>;
	stream(): ReadableStream;
}
