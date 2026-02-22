import type { Schema } from "./Schema";
import type { StandardSchemaV1 } from "./StandardSchema";

export type InferSchema<T extends Schema> = StandardSchemaV1.InferOutput<T>;
