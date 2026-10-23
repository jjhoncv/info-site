import { uploadModel } from "@/src/module/uploads/core";

export const dynamic = "force-dynamic";

// Sirve las imágenes subidas desde el admin (ADR 0006). Es pública: son las del sitio.
export async function GET(_req: Request, { params }: { params: Promise<{ key: string }> }) {
  const imagen = await uploadModel.readImage((await params).key);
  if (!imagen) return new Response("No encontrada", { status: 404 });
  return new Response(imagen.data as BodyInit, {
    headers: {
      "Content-Type": imagen.type,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
