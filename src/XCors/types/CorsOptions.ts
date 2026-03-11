import type { HeaderKey } from "@/CHeaders/types/HeaderKey";

export type CorsOptions = {
	/** Which origins are allowed to access the resource */
	allowedOrigins?: string[];

	/** Which HTTP methods are allowed (GET, POST, etc.) */
	allowedMethods?: string[];

	/** Which headers can be sent in the request */
	allowedHeaders?: HeaderKey[];

	/** Which headers should be exposed to the client/browser JavaScript
	 * These are response headers that the client can read
	 * @example ['RateLimit-Limit', 'RateLimit-Remaining', 'X-Custom-Header']
	 */
	exposedHeaders?: HeaderKey[];

	/** Whether to expose cookies and auth headers to the client */
	credentials?: boolean;
};
