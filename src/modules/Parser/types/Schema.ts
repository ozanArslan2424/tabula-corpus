import type { StandardSchemaV1 } from "@/modules/Parser/types/StandardSchema";

export interface Schema<T = unknown> extends StandardSchemaV1<unknown, T> {}
