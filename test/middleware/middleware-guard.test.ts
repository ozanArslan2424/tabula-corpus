import { reqMaker } from "../utils/reqMaker";
import { pathMaker } from "../utils/pathMaker";
import { testServer } from "../utils/testServer";
import { Route } from "@/modules/Route/Route";
import { describe, it, expect } from "bun:test";
import { HttpError } from "@/modules/HttpError/HttpError";
import {
	Status,
	type MiddlewareHandler,
	type MiddlewareUseOn,
} from "@/exports";
import { ControllerAbstract } from "@/modules/Controller/ControllerAbstract";
import { MiddlewareAbstract } from "@/modules/Middleware/MiddlewareAbstract";
import { useTempRouter } from "../utils/useTempRouter";
import { getRouterInstance } from "@/modules/Router/RouterInstance";

const prefix = "/middleware/guard";
const path = pathMaker(prefix);
const req = reqMaker(prefix);

class Controller1 extends ControllerAbstract {
	prefix = path("/c1");
	r1 = this.route("/r1", () => "ok");
	r2 = this.route("/r2", () => "ok");
}
class Controller2 extends ControllerAbstract {
	prefix = path("/c2");
	r3 = this.route("/r3", () => "ok");
	r4 = this.route("/r4", () => "ok");
}

const c1 = new Controller1();
const c2 = new Controller2();
const r5 = new Route(path("/r5"), () => "ok");
const r6 = new Route(path("/r6"), () => "ok");
new Route(path("/r7"), () => "ok");

class Middleware1 extends MiddlewareAbstract {
	override useOn = [c1.r1, r5];
	override handler: MiddlewareHandler = () => {
		throw HttpError.badRequest();
	};
}

class Middleware2 extends MiddlewareAbstract {
	useOn = [c2, r6];
	handler: MiddlewareHandler = () => {
		throw HttpError.badRequest();
	};
}

new Middleware1();
new Middleware2();

console.log(getRouterInstance().middlewares);

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
		await useTempRouter(async () => {
			new Route(path("/custom/r1"), () => "ok");
			new Route(path("/custom/r2"), () => "ok");
			new Route(path("/custom/r3"), () => "ok");

			class Middleware3 extends MiddlewareAbstract {
				useOn: MiddlewareUseOn = "*";
				handler: MiddlewareHandler = () => {
					throw HttpError.badRequest();
				};
			}

			new Middleware3();

			const res1 = await testServer.handle(req("/custom/r1"));
			expect(res1.status).toBe(Status.BAD_REQUEST);
			const res2 = await testServer.handle(req("/custom/r2"));
			expect(res2.status).toBe(Status.BAD_REQUEST);
			const res3 = await testServer.handle(req("/custom/r3"));
			expect(res3.status).toBe(Status.BAD_REQUEST);
		});
	});
});
