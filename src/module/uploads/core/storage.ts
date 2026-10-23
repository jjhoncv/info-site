import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { getStore } from "@netlify/blobs";

export type StoredImage = { data: Uint8Array; type: string };

// ADR 0006: en Netlify las imágenes van a un store de Netlify Blobs cuyo nombre sale de UPLOADS_STORE
// (un valor por contexto, como las MYSQL_*): así cada base tiene sus imágenes. Sin la variable no se toca ningún store.
// Fuera de Netlify (local y CI) Blobs no tiene dónde guardar: se usa una carpeta temporal con el nombre del store.
const enNetlify = () => Boolean(process.env.NETLIFY || process.env.NETLIFY_BLOBS_CONTEXT || process.env.DEPLOY_ID);

export class StoreNoConfigurado extends Error {
  constructor() {
    super("Falta la variable UPLOADS_STORE: no se lee ni se escribe ningún almacén de imágenes");
  }
}

function nombreStore(): string {
  const nombre = process.env.UPLOADS_STORE?.trim();
  if (nombre) return nombre;
  if (enNetlify()) throw new StoreNoConfigurado();
  return "uploads"; // solo local y CI
}
const carpetaLocal = () => join(tmpdir(), "info-site-uploads", nombreStore());
const store = () => getStore({ name: nombreStore(), consistency: "strong" });

export async function saveBlob(key: string, data: Uint8Array, type: string): Promise<void> {
  if (enNetlify()) {
    await store().set(key, new Blob([data as BlobPart], { type }), { metadata: { type } });
    return;
  }
  const carpeta = carpetaLocal();
  await mkdir(carpeta, { recursive: true });
  await writeFile(join(carpeta, key), data);
}

export async function readBlob(key: string): Promise<StoredImage | null> {
  if (enNetlify()) {
    const r = await store().getWithMetadata(key, { type: "arrayBuffer" });
    return r ? { data: new Uint8Array(r.data), type: String(r.metadata.type ?? "application/octet-stream") } : null;
  }
  const data = await readFile(join(carpetaLocal(), key)).catch(() => null);
  return data ? { data, type: TIPOS[key.split(".").pop() ?? ""] ?? "application/octet-stream" } : null;
}

// Borra todo lo subido (restaurar demo). Pagina la lista del store hasta vaciarlo.
export async function deleteAllBlobs(): Promise<void> {
  if (enNetlify()) {
    const s = store();
    for await (const pagina of s.list({ paginate: true })) {
      await Promise.all(pagina.blobs.map((b) => s.delete(b.key)));
    }
    return;
  }
  await rm(carpetaLocal(), { recursive: true, force: true });
}

const TIPOS: Record<string, string> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp" };
