import { Middleware } from "@/modules/Middleware/Middleware";
import { describe, it, expect } from "bun:test";
import { Controller, Route } from "@/index";
import { reqMaker } from "test/utils/reqMaker";
import { pathMaker } from "test/utils/pathMaker";
import { testServer } from "test/utils/testServer";

const globalPrefix = "/middleware/use-globally";
const path = pathMaker(globalPrefix);
const req = reqMaker(globalPrefix);

// TODO: Middleware call order is reversed

const register = (pfx: string) => {
	class TestController extends Controller {
		constructor() {
			super({ prefix: path(pfx) });
		}

		one = this.route("/one", (c) => c.data);

		two = this.route("/two", (c) => c.data);

		twoOverride = this.route("/two/override", (c) => c.data);
	}

	new TestController();
	new Route({ method: "GET", path: path("/route") }, (c) => c.data);
};

describe("Middleware Data", () => {
	it("useGlobally - Two Middlewares No Override", async () => {
		new Middleware({
			useOn: "*",
			handler: (c) => {
				c.data = { hello: "world" };
			},
		});
		new Middleware({
			useOn: "*",
			handler: (c) => {
				c.data.ozan = "arslan";
			},
		});
		register("/two");
		const res = await testServer.handle(req("/two/two", { method: "GET" }));
		expect(await res.json()).toEqual({
			hello: "world",
			ozan: "arslan",
		});
	});

	it("useGlobally - Two Middlewares WITH Override", async () => {
		new Middleware({
			useOn: "*",
			handler: (c) => {
				c.data.ozan = "arslan";
			},
		});
		new Middleware({
			useOn: "*",
			handler: (c) => {
				c.data = { hello: "world" };
			},
		});

		register("/three");
		const res = await testServer.handle(
			req("/three/two/override", { method: "GET" }),
		);
		expect(await res.json()).toEqual({ hello: "world" });
	});
});
