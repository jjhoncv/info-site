export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

export type ImageCheck =
  | { ok: true; type: string; ext: string }
  | { ok: false; error: string };

const NO_ES_IMAGEN = "No se aceptó el archivo: solo se admiten imágenes JPG, PNG o WebP.";
const MUY_PESADA = "No se aceptó la imagen: pesa más de 2 MB, el máximo permitido.";

const empieza = (bytes: Uint8Array, firma: number[], desde = 0) => firma.every((b, i) => bytes[desde + i] === b);
const ascii = (texto: string) => [...texto].map((c) => c.charCodeAt(0));

// Firmas de cada formato: se mira el contenido, no el nombre ni el tipo que declara el navegador.
const FORMATOS: { type: string; ext: string; es: (b: Uint8Array) => boolean }[] = [
  { type: "image/jpeg", ext: "jpg", es: (b) => empieza(b, [0xff, 0xd8, 0xff]) },
  { type: "image/png", ext: "png", es: (b) => empieza(b, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]) },
  { type: "image/webp", ext: "webp", es: (b) => empieza(b, ascii("RIFF")) && empieza(b, ascii("WEBP"), 8) },
];

export function validateImage(bytes: Uint8Array): ImageCheck {
  if (bytes.byteLength > MAX_IMAGE_BYTES) return { ok: false, error: MUY_PESADA };
  const formato = FORMATOS.find((f) => f.es(bytes));
  return formato ? { ok: true, type: formato.type, ext: formato.ext } : { ok: false, error: NO_ES_IMAGEN };
}
