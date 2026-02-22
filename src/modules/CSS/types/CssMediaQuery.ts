import type { CssProperties } from "@/modules/CSS/types/CssProperties";

export interface CssMediaQuery {
	condition: string;
	rules: CssProperties;
}
