import type { __Coreum_SchemaType } from "@/lib/Parser/__Coreum_SchemaType";

export type __Coreum_RouteSchemas<
	R = unknown,
	B = unknown,
	S = unknown,
	P = unknown,
> = {
	response?: __Coreum_SchemaType<R>;
	body?: __Coreum_SchemaType<B>;
	search?: __Coreum_SchemaType<S>;
	params?: __Coreum_SchemaType<P>;
};
