import { describe, expect, it } from "bun:test";
import { createTestServer } from "./utils/createTestServer";
import C from "@/index";
import net from "node:net";

const PORT = 4481;
const HOST = "localhost";

function rawRequest(path: string): string {
	return [
		`GET ${path} HTTP/1.1`,
		`Host: ${HOST}:${PORT}`,
		"Connection: keep-alive",
		"",
		"",
	].join("\r\n");
}

function send(socket: net.Socket, data: string): Promise<string> {
	return new Promise((resolve, reject) => {
		socket.once("data", (chunk) => resolve(chunk.toString()));
		socket.once("error", reject);
		socket.write(data);
	});
}

function waitForClose(socket: net.Socket): Promise<void> {
	return new Promise((resolve) => {
		socket.once("close", resolve);
		socket.once("end", () => socket.destroy());
	});
}

async function tester() {
	const socket = net.connect(PORT, HOST);
	await new Promise<void>((resolve, reject) => {
		socket.once("connect", resolve);
		socket.once("error", reject);
	});

	// First request — establishes the keep-alive connection
	await send(socket, rawRequest("/idle-timeout-test"));

	// Wait well past the idle timeout
	await Bun.sleep(200);

	// Try to send a second request on the same socket
	// The server should have closed it by now
	const closePromise = waitForClose(socket);
	socket.write(rawRequest("/idle-timeout-test"));

	// Either the socket is already closed or will close immediately
	await Promise.race([
		closePromise,
		Bun.sleep(500).then(() => {
			throw new Error("Socket was not closed by idle timeout");
		}),
	]);
}

describe("C.Server OPTIONS", () => {
	it("USING BUN - IDLE TIMEOUT - CLOSES IDLE KEEP-ALIVE CONNECTION", async () => {
		const s = createTestServer({ use: "bun", idleTimeout: 1 });
		new C.Route("/idle-timeout-test", () => "ok");
		await s.listen(PORT, HOST);
		let error: unknown;
		try {
			await tester();
		} catch (err) {
			console.error(err);
			error = err;
		} finally {
			await s.close();
		}
		expect(error).toBeDefined();
	});

	it("USING NODE - IDLE TIMEOUT - CLOSES IDLE KEEP-ALIVE CONNECTION", async () => {
		const s = createTestServer({ use: "node", idleTimeout: 1 });
		new C.Route("/idle-timeout-test", () => "ok");
		await s.listen(PORT, HOST);
		let error: unknown;
		try {
			await tester();
		} catch (err) {
			console.error(err);
			error = err;
		} finally {
			await s.close();
		}
		expect(error).toBeDefined();
	});
});
