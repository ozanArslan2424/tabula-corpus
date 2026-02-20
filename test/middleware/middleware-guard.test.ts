import { reqMaker } from "../utils/reqMaker";
import { pathMaker } from "../utils/pathMaker";
import { testServer } from "../utils/testServer";
import { Middleware } from "@/modules/Middleware/Middleware";
import { Route } from "@/modules/Route/Route";
import { describe, it, expect } from "bun:test";
import { HttpError } from "@/modules/HttpError/HttpError";
import { Status } from "@/exports";
import { ControllerAbstract } from "@/modules/Controller/ControllerAbstract";
import {
	getRouterInstance,
	setRouterInstance,
} from "@/modules/Router/RouterInstance";
import { Router } from "@/modules/Router/Router";

const prefix = "/middleware/guard";
const path = pathMaker(prefix);
const req = reqMaker(prefix);

class Controler1 extends ControllerAbstract {
	constructor() {
		super({ prefix: path("/c1") });
	}
	r1 = this.route("/r1", () => "ok");
	r2 = this.route("/r2", () => "ok");
}
class Controler2 extends ControllerAbstract {
	constructor() {
		super({ prefix: path("/c2") });
	}
	r3 = this.route("/r3", () => "ok");
	r4 = this.route("/r4", () => "ok");
}

const c1 = new Controler1();
const c2 = new Controler2();
const r5 = new Route(path("/r5"), () => "ok");
const r6 = new Route(path("/r6"), () => "ok");
new Route(path("/r7"), () => "ok");

new Middleware({
	useOn: [c1.r1, r5],
	handler: () => {
		throw HttpError.badRequest();
	},
});

new Middleware({
	useOn: [c2, r6],
	handler: () => {
		throw HttpError.badRequest();
	},
});

describe("Middleware Guard", () => {
	it("r1", async () => {
		const res = await testServer.handle(req("/c1/r1"));
		expect(res.status).toBe(Status.BAD_REQUEST);
	});
	it("r2", async () => {
		const res = await testServer.handle(req("/c1/r2"));
		expect(res.status).toBe(Status.OK);
	});
	it("r3", async () => {
		const res = await testServer.handle(req("/c2/r3"));
		expect(res.status).toBe(Status.BAD_REQUEST);
	});
	it("r4", async () => {
		const res = await testServer.handle(req("/c2/r4"));
		expect(res.status).toBe(Status.BAD_REQUEST);
	});
	it("r5", async () => {
		const res = await testServer.handle(req("/r5"));
		expect(res.status).toBe(Status.BAD_REQUEST);
	});
	it("r6", async () => {
		const res = await testServer.handle(req("/r6"));
		expect(res.status).toBe(Status.BAD_REQUEST);
	});
	it("r7", async () => {
		const res = await testServer.handle(req("/r7"));
		expect(res.status).toBe(Status.OK);
	});

	it("*", async () => {
		const originalRouter = getRouterInstance();
		const newRouter = new Router();
		setRouterInstance(newRouter);

		new Route(path("/custom/r1"), () => "ok");
		new Route(path("/custom/r2"), () => "ok");
		new Route(path("/custom/r3"), () => "ok");

		new Middleware({
			useOn: "*",
			handler: () => {
				throw HttpError.badRequest();
			},
		});

		const res1 = await testServer.handle(req("/custom/r1"));
		expect(res1.status).toBe(Status.BAD_REQUEST);
		const res2 = await testServer.handle(req("/custom/r2"));
		expect(res2.status).toBe(Status.BAD_REQUEST);
		const res3 = await testServer.handle(req("/custom/r3"));
		expect(res3.status).toBe(Status.BAD_REQUEST);

		setRouterInstance(originalRouter);
	});
});
