import { apiHandler, createResponse } from "@/src/lib/api";
import { withAdmin } from "@/src/module/auth/core";
import { uploadModel } from "@/src/module/uploads/core";

export const dynamic = "force-dynamic";

// Recibe la imagen del formulario (multipart, campo «file») y devuelve su URL.
export const POST = withAdmin(
  apiHandler(async (req: Request) => {
    const form = await req.formData().catch(() => undefined);
    const archivo = form?.get("file");
    if (!(archivo instanceof File)) return createResponse({ success: false, error: "Elige una imagen para subir" }, 400);
    const r = await uploadModel.saveImage(new Uint8Array(await archivo.arrayBuffer()));
    if (!r.ok) return createResponse({ success: false, error: r.error }, 400);
    return createResponse({ success: true, data: { url: r.url } }, 201);
  }),
);
