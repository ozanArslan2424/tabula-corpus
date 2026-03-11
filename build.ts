import { internalLogger } from "@/utils/internalLogger";
import type { BuildConfig } from "bun";
import dts from "bun-plugin-dts";

async function build() {
	try {
		await Bun.$`rm -rf ./dist`.quiet();
		internalLogger.log("🧹 Cleaned ./dist folder");
	} catch {
		internalLogger.warn(
			"⚠️  Could not clean ./dist folder (might not exist yet)",
		);
	}

	const defaultBuildConfig: BuildConfig = {
		entrypoints: ["./src/index.ts"],
		outdir: "./dist",
		target: "bun",
	};

	await Promise.all([
		Bun.build({
			...defaultBuildConfig,
			plugins: [
				dts({
					compilationOptions: {
						preferredConfigPath: "./tsconfig.build.json",
					},
				}),
			],
			format: "esm",
			naming: "[dir]/[name].js",
		}),
		Bun.build({
			...defaultBuildConfig,
			format: "cjs",
			naming: "[dir]/[name].cjs",
		}),
	]);
}

const start = performance.now();

await build();

const end = performance.now();
const startup = end - start;
internalLogger.log(`🚀 build function took ${startup.toFixed(2)}ms`);
