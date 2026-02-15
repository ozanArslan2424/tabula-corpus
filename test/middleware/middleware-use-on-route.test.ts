import { reqMaker } from "../utils/reqMaker";
import { pathMaker } from "../utils/pathMaker";
import { testServer } from "../utils/testServer";
import { Middleware } from "@/modules/Middleware/Middleware";
import { Route } from "@/modules/Route/Route";
import { describe, it, expect } from "bun:test";

const prefix = "/middleware/use-on-route";
const path = pathMaker(prefix);
const req = reqMaker(prefix);

describe("Middleware Data", () => {
	it("useOnRoute - One Middleware", async () => {
		const route = new Route(
			{ method: "GET", path: path("/one") },
			(c) => c.data,
		);
		new Middleware({
			useOn: route,
			handler: (c) => {
				c.data = { hello: "world" };
			},
		});

		const res = await testServer.handle(req("/one", { method: "GET" }));
		expect(await res.json()).toEqual({ hello: "world" });
	});

	it("useOnRoute - Two Middlewares No Override", async () => {
		const route = new Route(
			{ method: "GET", path: path("/two") },
			(c) => c.data,
		);
		new Middleware({
			useOn: route,
			handler: (c) => {
				c.data = { hello: "world" };
			},
		});
		new Middleware({
			useOn: route,
			handler: (c) => {
				c.data.ozan = "arslan";
			},
		});
		const res = await testServer.handle(req("/two", { method: "GET" }));
		expect(await res.json()).toEqual({ hello: "world", ozan: "arslan" });
	});

	it("useOnRoute - Two Middlewares WITH Override", async () => {
		const route = new Route(
			{ method: "GET", path: path("/two/override") },
			(c) => c.data,
		);
		new Middleware({
			useOn: route,
			handler: (c) => {
				c.data.ozan = "arslan";
			},
		});
		new Middleware({
			useOn: route,
			handler: (c) => {
				c.data = { hello: "world" };
			},
		});

		const res = await testServer.handle(
			req("/two/override", { method: "GET" }),
		);
		expect(await res.json()).toEqual({ hello: "world" });
	});

	it("useOnRoute - data array count", async () => {
		const r = new Route(path("/array"), (c) => {
			c.data.array?.push("END");
			return c.data;
		});

		new Middleware({
			useOn: r,
			handler: (c) => {
				c.data.array = [];
				c.data.array.push(1);
			},
		});
		new Middleware({
			useOn: r,
			handler: (c) => {
				c.data.array?.push(2);
			},
		});
		new Middleware({
			useOn: r,
			handler: (c) => {
				c.data.array?.push(3);
			},
		});
		new Middleware({
			useOn: r,
			handler: (c) => {
				c.data.array?.push("FOUR");
			},
		});
		new Middleware({
			useOn: r,
			handler: (c) => {
				c.data.array?.push(5);
			},
		});
		new Middleware({
			useOn: r,
			handler: (c) => {
				c.data.array?.push(6);
			},
		});
		new Middleware({
			useOn: r,
			handler: (c) => {
				c.data.array?.push(7);
			},
		});
		const res = await testServer.handle(req("/array"));
		const data = await res.json();
		expect(data).toBeDefined();
		expect(data.array).toBeArray();
		expect(data.array).toBeArrayOfSize(8);
		// testing middleware ordering
		expect(data.array[3]).toBe("FOUR");
		expect(data.array[data.array.length - 1]).toBe("END");
	});
});
