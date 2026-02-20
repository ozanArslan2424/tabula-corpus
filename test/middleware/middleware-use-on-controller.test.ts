import { describe, it, expect } from "bun:test";
import {
	Controller,
	type MiddlewareHandler,
	type MiddlewareUseOn,
} from "@/index";
import { reqMaker } from "../utils/reqMaker";
import { pathMaker } from "../utils/pathMaker";
import { testServer } from "../utils/testServer";
import { MiddlewareAbstract } from "@/modules/Middleware/MiddlewareAbstract";
import { useTempRouter } from "../utils/useTempRouter";

const globalPrefix = "/middleware/use-on-controller";
const path = pathMaker(globalPrefix);
const req = reqMaker(globalPrefix);

class Middleware1 extends MiddlewareAbstract {
	constructor(public useOn: MiddlewareUseOn) {
		super();
	}
	handler: MiddlewareHandler = (c) => {
		c.data = { hello: "world" };
	};
}

class Middleware2 extends MiddlewareAbstract {
	constructor(public useOn: MiddlewareUseOn) {
		super();
	}
	handler: MiddlewareHandler = (c) => {
		c.data.ozan = "arslan";
	};
}

class TestController extends Controller {
	prefix?: string | undefined;
	one = this.route(path("/one"), (c) => c.data);
	two = this.route(path("/two"), (c) => c.data);
	twoOverride = this.route(path("/two/override"), (c) => c.data);
}

describe("Middleware Data", () => {
	it("useOnController - Two Middlewares No Override", async () => {
		await useTempRouter(async () => {
			const c = new TestController();
			new Middleware1(c);
			new Middleware2(c);
			const res = await testServer.handle(req("/two"));
			expect(await res.json()).toEqual({ hello: "world", ozan: "arslan" });
		});
	});

	it("useOnController - Two Middlewares WITH Override", async () => {
		await useTempRouter(async () => {
			const c = new TestController();
			new Middleware2(c);
			new Middleware1(c);
			const res = await testServer.handle(req("/two"));
			expect(await res.json()).toEqual({ hello: "world", ozan: "arslan" });
		});
	});
});
