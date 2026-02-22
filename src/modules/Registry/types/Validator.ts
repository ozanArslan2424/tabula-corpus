import type { StandardSchemaV1 } from "@/modules/Parser/types/StandardSchema";

export type Validator<T = unknown> = StandardSchemaV1.Props<
	unknown,
	T
>["validate"];
