import { describe, it, expect } from "bun:test";
import {
	Controller,
	Route,
	type MiddlewareHandler,
	type MiddlewareUseOn,
} from "@/index";
import { pathMaker } from "../utils/pathMaker";
import { reqMaker } from "../utils/reqMaker";
import { testServer } from "../utils/testServer";
import { MiddlewareAbstract } from "@/modules/Middleware/MiddlewareAbstract";
import { useTempRouter } from "../utils/useTempRouter";

const globalPrefix = "/middleware/use-globally";
const path = pathMaker(globalPrefix);
const req = reqMaker(globalPrefix);

// TODO: Middleware call order is reversed

class Middleware1 extends MiddlewareAbstract {
	useOn: MiddlewareUseOn = "*";
	handler: MiddlewareHandler = (c) => {
		c.data = { hello: "world" };
	};
}

class Middleware2 extends MiddlewareAbstract {
	useOn: MiddlewareUseOn = "*";
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
	it("useGlobally - Two Middlewares No Override", async () => {
		await useTempRouter(async () => {
			new TestController();
			new Route({ method: "GET", path: path("/route") }, (c) => c.data);
			new Middleware1();
			new Middleware2();
			const res = await testServer.handle(req("/two"));
			expect(await res.json()).toEqual({ hello: "world", ozan: "arslan" });
		});
	});

	it("useGlobally - Two Middlewares WITH Override", async () => {
		await useTempRouter(async () => {
			new TestController();
			new Route({ method: "GET", path: path("/route") }, (c) => c.data);
			new Middleware2();
			new Middleware1();
			const res = await testServer.handle(req("/two/override"));
			expect(await res.json()).toEqual({ hello: "world" });
		});
	});
});
