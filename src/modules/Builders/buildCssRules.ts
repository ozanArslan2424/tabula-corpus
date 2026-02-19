import type { CssRule } from "@/modules/StaticRoute/types/CssRule";
import { CSS } from "@/modules/Builders/utils/CSS";

export function buildCssRUles(rules: Array<CssRule>): string {
	return CSS.build(rules);
}
