import { Middleware } from "@/modules/Middleware/Middleware";
import { describe, it, expect } from "bun:test";
import { Controller } from "@/index";
import { reqMaker } from "../utils/reqMaker";
import { pathMaker } from "../utils/pathMaker";
import { testServer } from "../utils/testServer";

const globalPrefix = "/middleware/use-on-controller";
const path = pathMaker(globalPrefix);
const req = reqMaker(globalPrefix);

class TestController extends Controller {
	constructor(prefix: string) {
		super({ prefix: path(prefix) });
	}

	one = this.route("/one", (c) => c.data);

	two = this.route("/two", (c) => c.data);

	twoOverride = this.route("/two/override", (c) => c.data);
}

describe("Middleware Data", () => {
	it("useOnController - One Middleware", async () => {
		const controller = new TestController("/one");
		new Middleware({
			useOn: controller,
			handler: (c) => {
				c.data = {
					hello: "world",
				};
			},
		});
		const res = await testServer.handle(req("/one/one", { method: "GET" }));
		expect(await res.json()).toEqual({ hello: "world" });
	});

	it("useOnController - Two Middlewares No Override", async () => {
		const controller = new TestController("/two");
		new Middleware({
			useOn: controller,
			handler: (c) => {
				c.data = { hello: "world" };
			},
		});
		new Middleware({
			useOn: controller,
			handler: (c) => {
				c.data.ozan = "arslan";
			},
		});
		const res = await testServer.handle(req("/two/two", { method: "GET" }));
		expect(await res.json()).toEqual({
			hello: "world",
			ozan: "arslan",
		});
	});

	it("useOnController - Two Middlewares WITH Override", async () => {
		const controller = new TestController("/three");
		new Middleware({
			useOn: controller,
			handler: (c) => {
				c.data.ozan = "arslan";
			},
		});
		new Middleware({
			useOn: controller,
			handler: (c) => {
				c.data = { hello: "world" };
			},
		});
		const res = await testServer.handle(
			req("/three/two/override", { method: "GET" }),
		);
		expect(await res.json()).toEqual({ hello: "world" });
	});
});
