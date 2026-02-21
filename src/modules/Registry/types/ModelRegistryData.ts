import type { SchemaData } from "@/modules/Registry/types/SchemaData";

export type ModelRegistryData<
	R = unknown,
	B = unknown,
	S = unknown,
	P = unknown,
> = {
	response?: SchemaData<R>;
	body?: SchemaData<B>;
	search?: SchemaData<S>;
	params?: SchemaData<P>;
};
