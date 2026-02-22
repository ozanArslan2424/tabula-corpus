import type { CssProperties } from "@/modules/CSS/types/CssProperties";
import type { CssKeyframes } from "@/modules/CSS/types/CssKeyframes";
import type { CssMediaQuery } from "@/modules/CSS/types/CssMediaQuery";

export interface CssRule {
	selector: string;
	properties: CssProperties;
	mediaQueries?: CssMediaQuery[];
	pseudoClasses?: {
		hover?: CssProperties;
		active?: CssProperties;
		focus?: CssProperties;
		visited?: CssProperties;
		disabled?: CssProperties;
		checked?: CssProperties;
		[key: string]: CssProperties | undefined;
	};
	pseudoElements?: {
		before?: CssProperties;
		after?: CssProperties;
		placeholder?: CssProperties;
		selection?: CssProperties;
		[key: string]: CssProperties | undefined;
	};
	keyframes?: {
		[name: string]: CssKeyframes;
	};
}
