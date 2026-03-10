import C from "@/index";
import { ServerUsingBun } from "@/Server/ServerUsingBun";
import { ServerUsingNode } from "@/Server/ServerUsingNode";

export function createTestServer(
	opts?: C.ServerOptions & { withLogging?: boolean; use?: "bun" | "node" },
) {
	const { withLogging, use, ...serverOpts } = opts ?? {
		withLogging: false,
		use: "bun",
	};
	const s =
		use === "bun"
			? new ServerUsingBun(serverOpts)
			: new ServerUsingNode(serverOpts);

	if (withLogging === true) {
		s.setOnError((err) => {
			console.error("thrown error", err);
			if (!(err instanceof Error)) {
				return new C.Response(
					{ error: err, message: "Unknown" },
					{ status: C.Status.INTERNAL_SERVER_ERROR },
				);
			}

			if (err instanceof C.Error) {
				return err.toResponse();
			}
			return new C.Response(
				{ error: err, message: err.message },
				{ status: C.Status.INTERNAL_SERVER_ERROR },
			);
		});

		s.setOnNotFound((req) => {
			console.error("not found request", req);
			return new C.Response(
				{ error: true, message: `${req.method} on ${req.url} does not exist.` },
				{ status: C.Status.NOT_FOUND },
			);
		});
	}

	return s;
}
