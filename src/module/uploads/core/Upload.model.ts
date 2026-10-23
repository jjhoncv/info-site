import { randomUUID } from "node:crypto";
import { validateImage } from "./image";
import uploadRepository from "./Upload.repository";
import { deleteAllBlobs, readBlob, saveBlob, type StoredImage } from "./storage";

export const MAX_UPLOADS = 30;
export const LIMIT_MESSAGE = "La demo llegó al límite de imágenes; restáurala para seguir probando";

export type SaveResult = { ok: true; url: string } | { ok: false; error: string };

// Las claves son las que generamos nosotros: nada que venga de la URL llega al disco ni a Blobs.
const CLAVE = /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}\.(jpg|png|webp)$/;

class UploadModel {
  // Valida el contenido real y el peso en el servidor; solo entonces guarda.
  async saveImage(bytes: Uint8Array): Promise<SaveResult> {
    const check = validateImage(bytes);
    if (!check.ok) return check;
    // El cupo se reserva con un UPDATE atómico; si el guardado falla se devuelve.
    if (!(await uploadRepository.reserve(MAX_UPLOADS))) return { ok: false, error: LIMIT_MESSAGE };
    const key = `${randomUUID()}.${check.ext}`;
    try {
      await saveBlob(key, bytes, check.type);
    } catch (error) {
      await uploadRepository.release();
      throw error;
    }
    return { ok: true, url: `/media/${key}` };
  }

  countImages(): Promise<number> {
    return uploadRepository.count();
  }

  // Primero las imágenes y luego el contador: si borrar falla, el contador sigue mostrando lo que hay.
  async deleteAll(): Promise<void> {
    await deleteAllBlobs();
    await uploadRepository.reset();
  }

  async readImage(key: string): Promise<StoredImage | null> {
    return CLAVE.test(key) ? readBlob(key) : null;
  }
}

const uploadModel = new UploadModel();
export default uploadModel;
