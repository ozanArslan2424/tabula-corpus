import type { RouterAdapterInterface } from "@/Router/adapters/RouterAdapterInterface";

export type ServerTlsOptions = {
	cert: string | Buffer;
	key: string | Buffer;
	ca?: string | Buffer;
};

export type ServerOptions = {
	adapter?: RouterAdapterInterface;
	idleTimeout?: number;
	tls?: ServerTlsOptions;
};
