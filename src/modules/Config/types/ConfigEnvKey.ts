import type { Env } from "@/types";
import type { OrString } from "@/types/OrString";

export type ConfigEnvKey = OrString<keyof Env>;
