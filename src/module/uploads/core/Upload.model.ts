import { getStore } from "@netlify/blobs";
import { randomUUID } from "node:crypto";
import type { ImageType } from "./image";

const EXTENSIONS: Record<ImageType, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

// Las claves que generamos: uuid + extensión. La ruta /media/<clave> no sirve ninguna otra.
export const MEDIA_KEY = /^[0-9a-f-]{36}\.(jpg|png|webp)$/;

const store = () => getStore("uploads");

export const uploadModel = {
  // Guarda la imagen ya validada y devuelve la ruta pública desde donde se sirve.
  async saveImage(bytes: Uint8Array, type: ImageType): Promise<string> {
    const key = `${randomUUID()}.${EXTENSIONS[type]}`;
    await store().set(key, new Blob([bytes as BlobPart], { type }), { metadata: { type } });
    return `/media/${key}`;
  },

  async getImage(key: string): Promise<{ data: ArrayBuffer; type: ImageType } | null> {
    const r = await store().getWithMetadata(key, { type: "arrayBuffer" });
    return r ? { data: r.data, type: r.metadata.type as ImageType } : null;
  },
};
