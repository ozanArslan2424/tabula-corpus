import type { Type } from "arktype";
import type { ZodType } from "zod";

export type __Coreum_SchemaType<O = unknown> =
	| ZodType<O> // toJSONSchema
	| Type<O>; // toJsonSchema
