// Validación de imágenes subidas: el tipo se lee del contenido (no de la extensión ni del Content-Type).
export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

export type ImageType = "image/jpeg" | "image/png" | "image/webp";

export const IMAGE_ERRORS = {
  empty: "No se recibió ningún archivo",
  type: "El archivo no es una imagen válida; sube un JPG, PNG o WebP",
  size: "La imagen pesa más de 2 MB; sube una más liviana",
} as const;

const startsWith = (bytes: Uint8Array, firma: number[], desde = 0) => firma.every((b, i) => bytes[desde + i] === b);

// Tipo real de la imagen según sus primeros bytes, o undefined si no es JPG, PNG ni WebP.
export function detectImageType(bytes: Uint8Array): ImageType | undefined {
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return "image/jpeg";
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "image/png";
  // WebP: «RIFF» + tamaño + «WEBP».
  if (startsWith(bytes, [0x52, 0x49, 0x46, 0x46]) && startsWith(bytes, [0x57, 0x45, 0x42, 0x50], 8)) return "image/webp";
  return undefined;
}

export type ImageCheck = { ok: true; type: ImageType } | { ok: false; error: string };

export function checkImage(bytes: Uint8Array): ImageCheck {
  if (bytes.byteLength === 0) return { ok: false, error: IMAGE_ERRORS.empty };
  if (bytes.byteLength > MAX_IMAGE_BYTES) return { ok: false, error: IMAGE_ERRORS.size };
  const type = detectImageType(bytes);
  return type ? { ok: true, type } : { ok: false, error: IMAGE_ERRORS.type };
}
