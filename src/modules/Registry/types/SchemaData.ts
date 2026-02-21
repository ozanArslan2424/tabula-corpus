import type { StandardSchemaV1 } from "@/modules/Parser/types/StandardSchema";

export type SchemaData<T = unknown> = {
	validate: StandardSchemaV1.Props<unknown, T>["validate"];
	vendor: StandardSchemaV1.Props<unknown, T>["vendor"];
};
