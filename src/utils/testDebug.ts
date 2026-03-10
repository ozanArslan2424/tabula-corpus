import { Config } from "@/Config";

export function testDebug(...data: any[]) {
	if (Config.nodeEnv !== "test") return;

	console.log("[TEST DEBUG]: ", ...data);
}
