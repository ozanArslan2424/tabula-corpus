import C from "@/index";
import { internalLogger } from "@/utils/internalLogger";

export function createTestServer(
	opts?: C.ServerOptions & { withLogging?: boolean },
) {
	const { withLogging, ...serverOpts } = opts ?? {
		withLogging: false,
	};
	const s = new C.Server(serverOpts);

	if (withLogging === true) {
		s.setOnError((err) => {
			internalLogger.error("thrown error", err);
			return s.defaultErrorHandler(err);
		});

		s.setOnNotFound((req) => {
			internalLogger.error("not found request", req);
			return s.defaultNotFoundHandler(req);
		});
	}

	return s;
}
