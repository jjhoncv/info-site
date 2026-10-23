import { randomUUID } from "node:crypto";
import { validateImage } from "./image";
import { readBlob, saveBlob, type StoredImage } from "./storage";

export type SaveResult = { ok: true; url: string } | { ok: false; error: string };

// Las claves son las que generamos nosotros: nada que venga de la URL llega al disco ni a Blobs.
const CLAVE = /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}\.(jpg|png|webp)$/;

class UploadModel {
  // Valida el contenido real y el peso en el servidor; solo entonces guarda.
  async saveImage(bytes: Uint8Array): Promise<SaveResult> {
    const check = validateImage(bytes);
    if (!check.ok) return check;
    const key = `${randomUUID()}.${check.ext}`;
    await saveBlob(key, bytes, check.type);
    return { ok: true, url: `/media/${key}` };
  }

  async readImage(key: string): Promise<StoredImage | null> {
    return CLAVE.test(key) ? readBlob(key) : null;
  }
}

const uploadModel = new UploadModel();
export default uploadModel;
