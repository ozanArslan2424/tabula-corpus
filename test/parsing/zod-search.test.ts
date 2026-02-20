import { describe, expect, it } from "bun:test";
import { reqMaker } from "../utils/reqMaker";
import { pathMaker } from "../utils/pathMaker";
import z from "zod";
import { testServer } from "../utils/testServer";
import { Status } from "@/modules/HttpResponse/enums/Status";
import { Route } from "@/modules/Route/Route";

const prefix = "/request-search/zod";
const path = pathMaker(prefix);
const req = reqMaker(prefix);

const stringSchema = z.object({ id: z.string() });
const referencedSchema = stringSchema;
const numberSchema = z.object({ id: z.number() });
const booleanSchema = z.object({ id: z.boolean() });
const multipleSchema = z.object({ userId: z.string(), postId: z.number() });
const constraintsSchema = z.object({ id: z.string().min(3) });
const uuidSchema = z.object({ id: z.uuid() });
const emailSchema = z.object({ email: z.email() });
const numericRangeSchema = z.object({ age: z.number().min(1).max(149) });
const literalEnumSchema = z.object({
	status: z.enum(["active", "inactive", "pending"]),
});
const complexNestedSchema = z.object({
	category: z.string(),
	id: z.uuid(),
	version: z.number().min(1),
});
const dateSchema = z.object({ date: z.coerce.date() });
const regexSchema = z.object({ code: z.string().regex(/^[A-Z]{3}-[0-9]{4}$/) });
const typeAliasSchema = z.object({
	id: z.number().min(1),
	slug: z
		.string()
		.transform((v) => v.toLocaleLowerCase().replace(/[^a-z0-9-]/g, "")),
});
const requiredSchema = z.object({ required: z.string() });

describe("Request Search Params - Zod", () => {
	it("STRING", async () => {
		new Route({ method: "GET", path: path("/string") }, (c) => c.search.id, {
			search: stringSchema,
		});
		const param = "hello";

		const res = await testServer.handle(
			req(`/string`, { method: "GET", search: { id: param } }),
		);
		expect(res.status).toBe(200);
		expect(await res.text()).toBe(param);
	});

	it("STRING - REFERENCED", async () => {
		new Route(
			{ method: "GET", path: path("/string/referenced") },
			(c) => c.search.id,
			{
				search: referencedSchema,
			},
		);
		const param = "hello";
		const res = await testServer.handle(
			req("/string/referenced", { method: "GET", search: { id: param } }),
		);
		expect(res.status).toBe(200);
		expect(await res.text()).toBe(param);
	});

	it("NUMBER", async () => {
		new Route({ method: "GET", path: path("/number") }, (c) => c.search.id, {
			search: numberSchema,
		});
		const param = 8;
		const res = await testServer.handle(
			req("/number", { method: "GET", search: { id: param } }),
		);
		expect(res.status).toBe(200);
		expect(await res.text().then((data) => parseInt(data))).toBe(param);
	});

	it("BOOLEAN", async () => {
		new Route({ method: "GET", path: path("/boolean") }, (c) => c.search.id, {
			search: booleanSchema,
		});
		const param = true;
		const res = await testServer.handle(
			req("/boolean", { method: "GET", search: { id: param } }),
		);
		expect(res.status).toBe(200);
		expect(await res.text().then((data) => data === "true")).toBe(param);
	});

	it("MULTIPLE SEARCH", async () => {
		new Route({ method: "GET", path: path("/multiple") }, (c) => c.search, {
			search: multipleSchema,
		});
		const userId = "user123";
		const postId = 456;
		const res = await testServer.handle(
			req("/multiple", { method: "GET", search: { userId, postId } }),
		);
		expect(res.status).toBe(200);
		const responseBody = await res.json();
		expect(responseBody).toEqual({ userId, postId });
	});

	it("SEARCH WITH CONSTRAINTS", async () => {
		new Route(
			{ method: "GET", path: path("/constraints") },
			(c) => c.search.id,
			{
				search: constraintsSchema,
			},
		);
		const validId = "hello";
		const res = await testServer.handle(
			req("/constraints", { method: "GET", search: { id: validId } }),
		);
		expect(res.status).toBe(200);
		expect(await res.text()).toBe(validId);
	});

	it("SEARCH WITH INVALID CONSTRAINT - SHOULD FAIL", async () => {
		new Route(
			{ method: "GET", path: path("/constraints/invalid") },
			(c) => c.search.id,
			{
				search: constraintsSchema,
			},
		);
		const invalidId = "s";
		const res = await testServer.handle(
			req("/constraints/invalid", { method: "GET", search: { id: invalidId } }),
		);
		expect(res.status).toBe(Status.UNPROCESSABLE_ENTITY);
	});

	it("UUID FORMAT", async () => {
		new Route({ method: "GET", path: path("/uuid") }, (c) => c.search.id, {
			search: uuidSchema,
		});
		const uuid = "123e4567-e89b-12d3-a456-426614174000";
		const res = await testServer.handle(
			req("/uuid", { method: "GET", search: { id: uuid } }),
		);
		expect(res.status).toBe(200);
		expect(await res.text()).toBe(uuid);
	});

	it("INVALID UUID - SHOULD FAIL", async () => {
		new Route(
			{ method: "GET", path: path("/uuid/invalid") },
			(c) => c.search.id,
			{
				search: uuidSchema,
			},
		);
		const invalidUuid = "not-a-uuid";
		const res = await testServer.handle(
			req("/uuid/invalid", { method: "GET", search: { id: invalidUuid } }),
		);
		expect(res.status).toBe(Status.UNPROCESSABLE_ENTITY);
	});

	it("EMAIL FORMAT", async () => {
		new Route({ method: "GET", path: path("/email") }, (c) => c.search.email, {
			search: emailSchema,
		});
		const email = "test@example.com";
		const res = await testServer.handle(
			req("/email", { method: "GET", search: { email } }),
		);
		expect(res.status).toBe(200);
		expect(await res.text()).toBe(email);
	});

	it("INVALID EMAIL - SHOULD FAIL", async () => {
		new Route(
			{ method: "GET", path: path("/email/invalid") },
			(c) => c.search.email,
			{
				search: emailSchema,
			},
		);
		const invalidEmail = "not-an-email";
		const res = await testServer.handle(
			req("/email/invalid", {
				method: "GET",
				search: { email: invalidEmail },
			}),
		);
		expect(res.status).toBe(Status.UNPROCESSABLE_ENTITY);
	});

	it("NUMERIC RANGE", async () => {
		new Route({ method: "GET", path: path("/range") }, (c) => c.search.age, {
			search: numericRangeSchema,
		});
		const validAge = 25;
		const res = await testServer.handle(
			req("/range", { method: "GET", search: { age: validAge } }),
		);
		expect(res.status).toBe(200);
		expect(await res.text().then(Number)).toBe(validAge);
	});

	it("OUT OF RANGE - SHOULD FAIL", async () => {
		new Route(
			{ method: "GET", path: path("/range/invalid") },
			(c) => c.search.age,
			{
				search: numericRangeSchema,
			},
		);
		const invalidAge = 200;
		const res = await testServer.handle(
			req("/range/invalid", { method: "GET", search: { age: invalidAge } }),
		);
		expect(res.status).toBe(Status.UNPROCESSABLE_ENTITY);
	});

	it("LITERAL VALUES", async () => {
		new Route(
			{ method: "GET", path: path("/literal") },
			(c) => c.search.status,
			{
				search: literalEnumSchema,
			},
		);
		const status = "active";
		const res = await testServer.handle(
			req(`/literal`, { method: "GET", search: { status } }),
		);
		expect(res.status).toBe(200);
		expect(await res.text()).toBe(status);
	});

	it("INVALID LITERAL - SHOULD FAIL", async () => {
		new Route(
			{ method: "GET", path: path("/literal/invalid") },
			(c) => c.search.status,
			{
				search: literalEnumSchema,
			},
		);
		const invalidStatus = "invalid";
		const res = await testServer.handle(
			req(`/literal/invalid`, {
				method: "GET",
				search: { status: invalidStatus },
			}),
		);
		expect(res.status).toBe(Status.UNPROCESSABLE_ENTITY);
	});

	it("COMPLEX NESTED VALIDATION", async () => {
		new Route({ method: "GET", path: path("/complex") }, (c) => c.search, {
			search: complexNestedSchema,
		});
		const category = "products";
		const id = "123e4567-e89b-12d3-a456-426614174000";
		const version = 2;
		const res = await testServer.handle(
			req(`/complex`, { method: "GET", search: { category, id, version } }),
		);
		expect(res.status).toBe(200);
		const responseBody = await res.json();
		expect(responseBody).toEqual({ category, id, version });
	});

	it("DATE STRING FORMAT", async () => {
		new Route({ method: "GET", path: path("/date") }, (c) => c.search.date, {
			search: dateSchema,
		});
		const date = "2024-01-01";
		const res = await testServer.handle(
			req("/date", { method: "GET", search: { date } }),
		);
		expect(res.status).toBe(200);
		expect(await res.text()).toBe(new Date(date).toISOString());
	});

	it("INVALID DATE - SHOULD FAIL", async () => {
		new Route(
			{ method: "GET", path: path("/date/invalid") },
			(c) => c.search.date,
			{
				search: dateSchema,
			},
		);
		const invalidDate = "not-a-date";
		const res = await testServer.handle(
			req(`/date/invalid`, { method: "GET", search: { date: invalidDate } }),
		);
		expect(res.status).toBe(Status.UNPROCESSABLE_ENTITY);
	});

	it("REGEX PATTERN", async () => {
		new Route({ method: "GET", path: path("/regex") }, (c) => c.search.code, {
			search: regexSchema,
		});
		const code = "ABC-1234";
		const res = await testServer.handle(
			req("/regex", { method: "GET", search: { code } }),
		);
		expect(res.status).toBe(200);
		expect(await res.text()).toBe(code);
	});

	it("INVALID REGEX PATTERN - SHOULD FAIL", async () => {
		new Route(
			{ method: "GET", path: path("/regex/invalid") },
			(c) => c.search.code,
			{
				search: regexSchema,
			},
		);
		const invalidCode = "abc-123";
		const res = await testServer.handle(
			req(`/regex/invalid`, { method: "GET", search: { code: invalidCode } }),
		);
		expect(res.status).toBe(Status.UNPROCESSABLE_ENTITY);
	});

	it("CUSTOM TYPE ALIAS", async () => {
		new Route({ method: "GET", path: path("/custom") }, (c) => c.search, {
			search: typeAliasSchema,
		});
		const id = 42;
		const slugValue = "my-slug-123";
		const res = await testServer.handle(
			req("/custom", { method: "GET", search: { id, slug: slugValue } }),
		);
		expect(res.status).toBe(200);
		const responseBody = await res.json();
		expect(responseBody).toEqual({ id, slug: slugValue });
	});

	it("MISSING REQUIRED SEARCH PARAM - SHOULD FAIL", async () => {
		new Route(
			{ method: "GET", path: path("/missing") },
			(c) => c.search.required,
			{ search: requiredSchema },
		);
		const res = await testServer.handle(req(`/missing`, { method: "GET" }));
		expect(res.status).toBe(Status.UNPROCESSABLE_ENTITY);
	});
});
