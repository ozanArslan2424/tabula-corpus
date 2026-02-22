import { ControllerAbstract } from "@/modules/Controller/ControllerAbstract";
import { HttpError } from "@/modules/HttpError/HttpError";
import { CommonHeaders } from "@/modules/HttpHeaders/enums/CommonHeaders";
import { Status } from "@/modules/HttpResponse/enums/Status";
import { Parser } from "@/modules/Parser/Parser";
import { Route } from "@/modules/Route/Route";
import { type } from "arktype";
import { describe, expect, it } from "bun:test";
import z from "zod";
import { testServer } from "../utils/testServer";
import { joinPathSegments } from "@/utils/joinPathSegments";
import { getRouterInstance } from "@/index";
import { TEST_URL } from "../utils/TEST_URL";
import type { StandardSchemaV1 } from "@/modules/Parser/types/StandardSchema";

const successData = { hello: 1 };
const failData = { unknown: "object" };
const successRouteData = {
	params: successData,
	search: successData,
	body: successData,
};
const failRouteData = {
	params: failData,
	search: failData,
	body: failData,
};

type ST = typeof successRouteData;

const arkBasic = type({ hello: "number" });

const zodBasic = z.object({ hello: z.number() });

class Model {
	static arkModelBasic = type({ hello: "number" });

	static zodModelBasic = z.object({ hello: z.number() });

	static arkReferenced = arkBasic;

	static zodReferenced = zodBasic;

	static arkRoute = {
		params: type({ hello: "number" }),
		search: type({ hello: "number" }),
		body: type({ hello: "number" }),
	};

	static zodRoute = {
		params: z.object({ hello: z.number() }),
		search: z.object({ hello: z.number() }),
		body: z.object({ hello: z.number() }),
	};

	static arkRouteReferenced = {
		params: this.arkModelBasic,
		search: this.arkRoute.search,
		body: arkBasic,
	};

	static zodRouteReferenced = {
		params: this.zodModelBasic,
		search: this.zodRoute.search,
		body: zodBasic,
	};

	static combined = {
		params: type({ hello: "number" }),
		search: z.object({ hello: z.number() }),
		body: this.arkRoute.body,
	};
}

class Controller extends ControllerAbstract {
	constructor() {
		super({ prefix: "/controller" });
	}

	arkRoute = this.route(
		{ method: "POST", path: "/arkRoute/:hello" },
		(c) => ({ body: c.body, params: c.params, search: c.search }),
		Model.arkRoute,
	);
	arkRouteReferenced = this.route(
		{ method: "POST", path: "/arkRouteReferenced/:hello" },
		(c) => ({ body: c.body, params: c.params, search: c.search }),
		Model.arkRouteReferenced,
	);
	zodRoute = this.route(
		{ method: "POST", path: "/zodRoute/:hello" },
		(c) => ({ body: c.body, params: c.params, search: c.search }),
		Model.zodRoute,
	);
	zodRouteReferenced = this.route(
		{ method: "POST", path: "/zodRouteReferenced/:hello" },
		(c) => ({ body: c.body, params: c.params, search: c.search }),
		Model.zodRouteReferenced,
	);
	combined = this.route(
		{ method: "POST", path: "/combined/:hello" },
		(c) => ({ body: c.body, params: c.params, search: c.search }),
		Model.combined,
	);

	optional = this.route("/optional", (c) => c.search, {
		search: type({ "groupId?": "number | undefined" }),
	});

	missing = this.route("/missing/:param", (c) => c.params.param, {
		params: type({ param: "string" }),
	});
}

new Controller();

const path = (...segments: (string | number)[]) =>
	`${TEST_URL}${joinPathSegments(
		getRouterInstance().globalPrefix,
		...segments,
	)}`;

const getValidator = (arg: StandardSchemaV1) => arg["~standard"].validate;

describe("adaptive parsing based on library and schema definition", () => {
	it("arkBasic - success", async () => {
		expect(await Parser.parse(successData, getValidator(arkBasic))).toEqual(
			successData,
		);
	});
	it("zodBasic - success", async () => {
		expect(await Parser.parse(successData, getValidator(zodBasic))).toEqual(
			successData,
		);
	});
	it("arkModelBasic - success", async () => {
		expect(
			await Parser.parse(successData, getValidator(Model.arkModelBasic)),
		).toEqual(successData);
	});
	it("zodModelBasic - success", async () => {
		expect(
			await Parser.parse(successData, getValidator(Model.zodModelBasic)),
		).toEqual(successData);
	});
	it("arkReferenced - success", async () => {
		expect(
			await Parser.parse(successData, getValidator(Model.arkReferenced)),
		).toEqual(successData);
	});
	it("zodReferenced - success", async () => {
		expect(
			await Parser.parse(successData, getValidator(Model.zodReferenced)),
		).toEqual(successData);
	});
	it("arkRoute - success", async () => {
		expect(
			await Parser.parse(
				successRouteData.params,
				getValidator(Model.arkRoute.params),
			),
		).toEqual(successRouteData.params);
		expect(
			await Parser.parse(
				successRouteData.search,
				getValidator(Model.arkRoute.search),
			),
		).toEqual(successRouteData.search);
		expect(
			await Parser.parse(
				successRouteData.body,
				getValidator(Model.arkRoute.body),
			),
		).toEqual(successRouteData.body);
	});
	it("zodRoute - success", async () => {
		expect(
			await Parser.parse(
				successRouteData.params,
				getValidator(Model.zodRoute.params),
			),
		).toEqual(successRouteData.params);
		expect(
			await Parser.parse(
				successRouteData.search,
				getValidator(Model.zodRoute.search),
			),
		).toEqual(successRouteData.search);
		expect(
			await Parser.parse(
				successRouteData.body,
				getValidator(Model.zodRoute.body),
			),
		).toEqual(successRouteData.body);
	});
	it("arkRouteReferenced - success", async () => {
		expect(
			await Parser.parse(
				successRouteData.params,
				getValidator(Model.arkRouteReferenced.params),
			),
		).toEqual(successRouteData.params);
		expect(
			await Parser.parse(
				successRouteData.search,
				getValidator(Model.arkRouteReferenced.search),
			),
		).toEqual(successRouteData.search);
		expect(
			await Parser.parse(
				successRouteData.body,
				getValidator(Model.arkRouteReferenced.body),
			),
		).toEqual(successRouteData.body);
	});
	it("zodRouteReferenced - success", async () => {
		expect(
			await Parser.parse(
				successRouteData.params,
				getValidator(Model.zodRouteReferenced.params),
			),
		).toEqual(successRouteData.params);
		expect(
			await Parser.parse(
				successRouteData.search,
				getValidator(Model.zodRouteReferenced.search),
			),
		).toEqual(successRouteData.search);
		expect(
			await Parser.parse(
				successRouteData.body,
				getValidator(Model.zodRouteReferenced.body),
			),
		).toEqual(successRouteData.body);
	});
	it("arkRoute - Real Request - success", async () => {
		new Route(
			{ method: "POST", path: "/success/arkRoute/hello/:hello" },
			(c) => ({ body: c.body, params: c.params, search: c.search }),
			Model.arkRoute,
		);
		const url = new URL(
			path("success", "arkRoute", "hello", successRouteData.params.hello),
		);
		url.searchParams.set("hello", successRouteData.search.hello.toString());
		const res = await testServer.handle(
			new Request(url, {
				body: JSON.stringify(successRouteData.body),
				method: "POST",
				headers: { [CommonHeaders.ContentType]: "application/json" },
			}),
		);
		expect(await Parser.getBody<ST>(res)).toEqual(successRouteData);
	});
	it("zodRoute - Real Request - success", async () => {
		new Route(
			{ method: "POST", path: "/success/zodRoute/hello/:hello" },
			(c) => ({ body: c.body, params: c.params, search: c.search }),
			Model.zodRoute,
		);
		const url = new URL(
			path("success", "zodRoute", "hello", successRouteData.params.hello),
		);
		url.searchParams.set("hello", successRouteData.search.hello.toString());
		const res = await testServer.handle(
			new Request(url, {
				body: JSON.stringify(successRouteData.body),
				method: "POST",
				headers: { [CommonHeaders.ContentType]: "application/json" },
			}),
		);
		expect(await Parser.getBody<ST>(res)).toEqual(successRouteData);
	});
	it("arkRouteReferenced - Real Request - success", async () => {
		new Route(
			{ method: "POST", path: "/success/arkRouteReferenced/hello/:hello" },
			(c) => ({ body: c.body, params: c.params, search: c.search }),
			Model.arkRouteReferenced,
		);
		const url = new URL(
			path(
				"success",
				"arkRouteReferenced",
				"hello",
				successRouteData.params.hello,
			),
		);
		url.searchParams.set("hello", successRouteData.search.hello.toString());
		const res = await testServer.handle(
			new Request(url, {
				body: JSON.stringify(successRouteData.body),
				method: "POST",
				headers: { [CommonHeaders.ContentType]: "application/json" },
			}),
		);
		expect(await Parser.getBody<ST>(res)).toEqual(successRouteData);
	});
	it("zodRouteReferenced - Real Request - success", async () => {
		new Route(
			{ method: "POST", path: "/success/zodRouteReferenced/hello/:hello" },
			(c) => ({ body: c.body, params: c.params, search: c.search }),
			Model.zodRouteReferenced,
		);
		const url = new URL(
			path(
				"success",
				"zodRouteReferenced",
				"hello",
				successRouteData.params.hello,
			),
		);
		url.searchParams.set("hello", successRouteData.search.hello.toString());
		const res = await testServer.handle(
			new Request(url, {
				body: JSON.stringify(successRouteData.body),
				method: "POST",
				headers: { [CommonHeaders.ContentType]: "application/json" },
			}),
		);
		expect(await Parser.getBody<ST>(res)).toEqual(successRouteData);
	});
	it("combined - Real Request - success", async () => {
		new Route(
			{ method: "POST", path: "/success/combined/hello/:hello" },
			(c) => ({ body: c.body, params: c.params, search: c.search }),
			Model.combined,
		);
		const url = new URL(
			path("success", "combined", "hello", successRouteData.params.hello),
		);
		url.searchParams.set("hello", successRouteData.search.hello.toString());
		const res = await testServer.handle(
			new Request(url, {
				body: JSON.stringify(successRouteData.body),
				method: "POST",
				headers: { [CommonHeaders.ContentType]: "application/json" },
			}),
		);
		expect(await Parser.getBody<ST>(res)).toEqual(successRouteData);
	});
	it("Controller - Real Request - success", async () => {
		const url = new URL(
			path("controller", "combined", successRouteData.params.hello),
		);
		url.searchParams.set("hello", successRouteData.search.hello.toString());
		const res = await testServer.handle(
			new Request(url, {
				body: JSON.stringify(successRouteData.body),
				method: "POST",
				headers: { [CommonHeaders.ContentType]: "application/json" },
			}),
		);
		expect(await Parser.getBody<ST>(res)).toEqual(successRouteData);
	});

	it("arkBasic - fail", () => {
		expect(
			async () => await Parser.parse(failData, getValidator(arkBasic)),
		).toThrow(HttpError);
	});
	it("zodBasic - fail", () => {
		expect(
			async () => await Parser.parse(failData, getValidator(zodBasic)),
		).toThrow(HttpError);
	});
	it("arkModelBasic - fail", () => {
		expect(
			async () =>
				await Parser.parse(failData, getValidator(Model.arkModelBasic)),
		).toThrow(HttpError);
	});
	it("zodModelBasic - fail", () => {
		expect(
			async () =>
				await Parser.parse(failData, getValidator(Model.zodModelBasic)),
		).toThrow(HttpError);
	});
	it("arkReferenced - fail", () => {
		expect(
			async () =>
				await Parser.parse(failData, getValidator(Model.arkReferenced)),
		).toThrow(HttpError);
	});
	it("zodReferenced - fail", () => {
		expect(
			async () =>
				await Parser.parse(failData, getValidator(Model.zodReferenced)),
		).toThrow(HttpError);
	});
	it("arkRoute - fail", () => {
		expect(
			async () =>
				await Parser.parse(
					failRouteData.params,
					getValidator(Model.arkRoute.params),
				),
		).toThrow(HttpError);
		expect(
			async () =>
				await Parser.parse(
					failRouteData.search,
					getValidator(Model.arkRoute.search),
				),
		).toThrow(HttpError);
		expect(
			async () =>
				await Parser.parse(
					failRouteData.body,
					getValidator(Model.arkRoute.body),
				),
		).toThrow(HttpError);
	});
	it("zodRoute - fail", () => {
		expect(
			async () =>
				await Parser.parse(
					failRouteData.params,
					getValidator(Model.zodRoute.params),
				),
		).toThrow(HttpError);
		expect(
			async () =>
				await Parser.parse(
					failRouteData.search,
					getValidator(Model.zodRoute.search),
				),
		).toThrow(HttpError);
		expect(
			async () =>
				await Parser.parse(
					failRouteData.body,
					getValidator(Model.zodRoute.body),
				),
		).toThrow(HttpError);
	});
	it("arkRouteReferenced - fail", () => {
		expect(
			async () =>
				await Parser.parse(
					failRouteData.params,
					getValidator(Model.arkRouteReferenced.params),
				),
		).toThrow(HttpError);
		expect(
			async () =>
				await Parser.parse(
					failRouteData.search,
					getValidator(Model.arkRouteReferenced.search),
				),
		).toThrow(HttpError);
		expect(
			async () =>
				await Parser.parse(
					failRouteData.body,
					getValidator(Model.arkRouteReferenced.body),
				),
		).toThrow(HttpError);
	});
	it("zodRouteReferenced - fail", () => {
		expect(
			async () =>
				await Parser.parse(
					failRouteData.params,
					getValidator(Model.zodRouteReferenced.params),
				),
		).toThrow(HttpError);
		expect(
			async () =>
				await Parser.parse(
					failRouteData.search,
					getValidator(Model.zodRouteReferenced.search),
				),
		).toThrow(HttpError);
		expect(
			async () =>
				await Parser.parse(
					failRouteData.body,
					getValidator(Model.zodRouteReferenced.body),
				),
		).toThrow(HttpError);
	});
	it("arkRoute - Real Request - fail", async () => {
		new Route(
			{ method: "POST", path: "/fail/arkRoute/hello/:hello" },
			(c) => ({ body: c.body, params: c.params, search: c.search }),
			Model.arkRoute,
		);
		const url = new URL(
			path("fail", "arkRoute", "hello", failRouteData.params.unknown),
		);
		url.searchParams.set("unknown", failRouteData.search.unknown);
		const res = await testServer.handle(
			new Request(url, {
				body: JSON.stringify(failRouteData.body),
				method: "POST",
				headers: { [CommonHeaders.ContentType]: "application/json" },
			}),
		);
		expect(res.ok).toBe(false);
		expect(res.status).toBe(Status.UNPROCESSABLE_ENTITY);
	});
	it("zodRoute - Real Request - fail", async () => {
		new Route(
			{ method: "POST", path: "/fail/zodRoute/hello/:hello" },
			(c) => ({ body: c.body, params: c.params, search: c.search }),
			Model.zodRoute,
		);
		const url = new URL(
			path("fail", "zodRoute", "hello", failRouteData.params.unknown),
		);
		url.searchParams.set("unknown", failRouteData.search.unknown);
		const res = await testServer.handle(
			new Request(url, {
				body: JSON.stringify(failRouteData.body),
				method: "POST",
				headers: { [CommonHeaders.ContentType]: "application/json" },
			}),
		);
		expect(res.ok).toBe(false);
		expect(res.status).toBe(Status.UNPROCESSABLE_ENTITY);
	});
	it("arkRouteReferenced - Real Request - fail", async () => {
		new Route(
			{ method: "POST", path: "/fail/arkRouteReferenced/hello/:hello" },
			(c) => ({ body: c.body, params: c.params, search: c.search }),
			Model.arkRouteReferenced,
		);
		const url = new URL(
			path("fail", "arkRouteReferenced", "hello", failRouteData.params.unknown),
		);
		url.searchParams.set("unknown", failRouteData.search.unknown);
		const res = await testServer.handle(
			new Request(url, {
				body: JSON.stringify(failRouteData.body),
				method: "POST",
				headers: { [CommonHeaders.ContentType]: "application/json" },
			}),
		);
		expect(res.ok).toBe(false);
		expect(res.status).toBe(Status.UNPROCESSABLE_ENTITY);
	});
	it("zodRouteReferenced - Real Request - fail", async () => {
		new Route(
			{ method: "POST", path: "/fail/zodRouteReferenced/hello/:hello" },
			(c) => ({ body: c.body, params: c.params, search: c.search }),
			Model.zodRouteReferenced,
		);
		const url = new URL(
			path("fail", "zodRouteReferenced", "hello", failRouteData.params.unknown),
		);
		url.searchParams.set("unknown", failRouteData.search.unknown);
		const res = await testServer.handle(
			new Request(url, {
				body: JSON.stringify(failRouteData.body),
				method: "POST",
				headers: { [CommonHeaders.ContentType]: "application/json" },
			}),
		);
		expect(res.ok).toBe(false);
		expect(res.status).toBe(Status.UNPROCESSABLE_ENTITY);
	});
	it("combined - Real Request - fail", async () => {
		new Route(
			{ method: "POST", path: "/fail/combined/hello/:hello" },
			(c) => ({ body: c.body, params: c.params, search: c.search }),
			Model.combined,
		);
		const url = new URL(
			path("fail", "combined", "hello", failRouteData.params.unknown),
		);
		url.searchParams.set("unknown", failRouteData.search.unknown);
		const res = await testServer.handle(
			new Request(url, {
				body: JSON.stringify(failRouteData.body),
				method: "POST",
				headers: { [CommonHeaders.ContentType]: "application/json" },
			}),
		);
		expect(res.ok).toBe(false);
		expect(res.status).toBe(Status.UNPROCESSABLE_ENTITY);
	});

	it("optional - provided", async () => {
		const url = new URL(path("controller", "optional"));
		url.searchParams.set("groupId", "8");
		const res = await testServer.handle(new Request(url));
		expect(await Parser.getBody<{ groupId: number }>(res)).toEqual({
			groupId: 8,
		});
	});

	it("optional - missing", async () => {
		const url = new URL(path("controller", "optional"));
		const res = await testServer.handle(new Request(url));
		const body = await Parser.getBody<{}>(res);
		expect(body).toBeEmptyObject();
	});

	it("missing required param", async () => {
		const url = new URL(path("controller", "missing"));
		const res = await testServer.handle(new Request(url));
		expect(res.ok).toBe(false);
	});
});
