import { apiHandler, createResponse } from "@/src/lib/api";
import { withAdmin } from "@/src/module/auth/core";
import { serviceModel } from "@/src/module/services/core";

export const dynamic = "force-dynamic";

export const GET = withAdmin(
  apiHandler(async () => createResponse({ success: true, data: await serviceModel.getServices() })),
);
