import type { CommonHeaders } from "@/modules/HttpHeaders/enums/CommonHeaders";
import type { OrString } from "@/types/OrString";

export type HttpHeaderKey = OrString<CommonHeaders>;
