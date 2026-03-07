import C from "@/index";
import { describe, expect, it } from "bun:test";
import { createTestServer } from "./utils/createTestServer";
import { req } from "./utils/req";
// import { MemoiristAdapter } from "@/Router/adapters/MemoiristAdapter";

// const sMemoirist = createTestServer({
// 	adapter: new MemoiristAdapter(),
// });
//
describe("Router Adapter - DEFAULT", () => {
	const s = createTestServer();

	// 405 or 404? that is the question
	it("WRONG METHOD RETURNS METHOD NOT ALLOWED", async () => {
		const path = "/r7/strict";
		new C.Route({ method: C.Method.POST, path }, async () => "strict");

		const res = await s.handle(req(path, { method: "GET" }));
		expect(res.status).toBe(405);
	});
});
