import type { __Coreum_Request } from "@/lib/Request/__Coreum_Request";
import type { __Coreum_Response } from "@/lib/Response/__Coreum_Response";

export type __Coreum_FetchCallback = (
	req: __Coreum_Request,
) => Promise<__Coreum_Response>;
