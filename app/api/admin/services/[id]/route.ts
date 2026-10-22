import { apiHandler, createResponse } from "@/src/lib/api";
import { withAdmin } from "@/src/module/auth/core";
import { serviceModel } from "@/src/module/services/core";

type Contexto = { params: Promise<{ id: string }> };

export const DELETE = withAdmin(
  apiHandler(async (_req: Request, { params }: Contexto) => {
    const id = Number((await params).id);
    if (!Number.isInteger(id) || id < 1) return createResponse({ success: false, error: "Id no válido" }, 400);
    if (!(await serviceModel.deleteService(id))) {
      return createResponse({ success: false, error: "No encontramos ese servicio" }, 404);
    }
    return createResponse({ success: true, message: "Servicio eliminado" });
  }),
);
