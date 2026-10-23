import { apiHandler, createResponse, parseBody } from "@/src/lib/api";
import { DEMO_USER_ID, withAdmin } from "@/src/module/auth/core";
import { ServiceSchema, serviceModel } from "@/src/module/services/core";

type Contexto = { params: Promise<{ id: string }> };

const leerId = async ({ params }: Contexto) => {
  const id = Number((await params).id);
  return Number.isInteger(id) && id > 0 ? id : undefined;
};

const ID_INVALIDO = () => createResponse({ success: false, error: "Id no válido" }, 400);

export const PATCH = withAdmin(
  apiHandler(async (req: Request, contexto: Contexto) => {
    const id = await leerId(contexto);
    if (!id) return ID_INVALIDO();
    const { data, response } = await parseBody(req, ServiceSchema.partial());
    if (response) return response;
    const otro = data.slug ? await serviceModel.getServiceBySlug(data.slug) : null;
    if (otro && otro.id !== id) {
      return createResponse({ success: false, error: "Ya existe un servicio con esa dirección" }, 409);
    }
    const actualizado = await serviceModel.updateService(id, data, DEMO_USER_ID);
    if (!actualizado) return createResponse({ success: false, error: "No encontramos ese servicio" }, 404);
    return createResponse({ success: true, message: "Servicio guardado", data: actualizado });
  }),
);

export const DELETE = withAdmin(
  apiHandler(async (_req: Request, contexto: Contexto) => {
    const id = await leerId(contexto);
    if (!id) return ID_INVALIDO();
    if (!(await serviceModel.deleteService(id))) {
      return createResponse({ success: false, error: "No encontramos ese servicio" }, 404);
    }
    return createResponse({ success: true, message: "Servicio eliminado" });
  }),
);
