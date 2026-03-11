import { Config } from "@/Config/Config";
import { internalLogger } from "@/utils/internalLogger";

export function testDebug(...data: any[]) {
	if (Config.nodeEnv !== "test") return;

	internalLogger.log("[TEST DEBUG]: ", ...data);
}
