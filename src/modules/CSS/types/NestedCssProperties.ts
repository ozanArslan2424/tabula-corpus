import type { CssValue } from "@/modules/CSS/types/CssValue";

export interface NestedCssProperties {
	[key: string]: CssValue | NestedCssProperties;
}
