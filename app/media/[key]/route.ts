import { MEDIA_KEY, uploadModel } from "@/src/module/uploads/core";

export const dynamic = "force-dynamic";

// Sirve las imágenes subidas desde el admin (ADR 0006).
export async function GET(_req: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const image = MEDIA_KEY.test(key) ? await uploadModel.getImage(key) : null;
  if (!image) return new Response("No encontrada", { status: 404 });
  return new Response(image.data, {
    headers: { "Content-Type": image.type, "X-Content-Type-Options": "nosniff", "Cache-Control": "public, max-age=3600" },
  });
}
