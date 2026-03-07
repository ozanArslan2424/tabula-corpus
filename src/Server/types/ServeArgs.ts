export type ServeArgs = {
	port: number;
	hostname?: "0.0.0.0" | "127.0.0.1" | "localhost" | (string & {}) | undefined;
	fetch: (request: Request) => Promise<Response>;
};
