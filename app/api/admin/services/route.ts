import { apiHandler, createResponse, parseBody } from "@/src/lib/api";
import { DEMO_USER_ID, withAdmin } from "@/src/module/auth/core";
import { ServiceSchema, serviceModel } from "@/src/module/services/core";

export const dynamic = "force-dynamic";

export const GET = withAdmin(
  apiHandler(async () => createResponse({ success: true, data: await serviceModel.getServices() })),
);

export const POST = withAdmin(
  apiHandler(async (req: Request) => {
    const { data, response } = await parseBody(req, ServiceSchema);
    if (response) return response;
    if (await serviceModel.getServiceBySlug(data.slug)) {
      return createResponse({ success: false, error: "Ya existe un servicio con esa dirección" }, 409);
    }
    const creado = await serviceModel.createService(data, DEMO_USER_ID);
    return createResponse({ success: true, message: "Servicio creado", data: creado }, 201);
  }),
);
