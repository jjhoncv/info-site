import { apiHandler, createResponse } from "@/src/lib/api";
import { withAdmin } from "@/src/module/auth/core";
import { checkImage, uploadModel } from "@/src/module/uploads/core";

export const dynamic = "force-dynamic";

// Sube una imagen (campo «file» de un formulario). Valida tipo real y peso en el servidor.
export const POST = withAdmin(
  apiHandler(async (req: Request) => {
    const form = await req.formData().catch(() => undefined);
    const file = form?.get("file");
    const bytes = file instanceof File ? new Uint8Array(await file.arrayBuffer()) : new Uint8Array();
    const check = checkImage(bytes);
    if (!check.ok) return createResponse({ success: false, error: check.error }, 400);
    const url = await uploadModel.saveImage(bytes, check.type);
    return createResponse({ success: true, message: "Imagen subida", data: { url } }, 201);
  }),
);
