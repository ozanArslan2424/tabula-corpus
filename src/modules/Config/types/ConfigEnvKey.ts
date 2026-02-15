import type { Env } from "@/types";
import type { OrString } from "@/utils/OrString";

export type ConfigEnvKey = OrString<keyof Env>;
