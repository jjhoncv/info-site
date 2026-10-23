import { describe, expect, it } from "vitest";
import { MAX_IMAGE_BYTES, validateImage } from "../core/image";

const bytes = (...cabecera: number[]) => Uint8Array.from([...cabecera, ...new Array(20).fill(0)]);
const JPG = bytes(0xff, 0xd8, 0xff, 0xe0);
const PNG = bytes(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a);
const WEBP = Uint8Array.from([...Buffer.from("RIFF"), 0, 0, 0, 0, ...Buffer.from("WEBP"), 0, 0]);

describe("validateImage", () => {
  it("acepta JPG, PNG y WebP por su contenido", () => {
    expect(validateImage(JPG)).toEqual({ ok: true, type: "image/jpeg", ext: "jpg" });
    expect(validateImage(PNG)).toEqual({ ok: true, type: "image/png", ext: "png" });
    expect(validateImage(WEBP)).toEqual({ ok: true, type: "image/webp", ext: "webp" });
  });

  it("rechaza un archivo que no es imagen aunque se llame .png", () => {
    const r = validateImage(Uint8Array.from(Buffer.from("<script>alert(1)</script>")));
    expect(r).toEqual({ ok: false, error: "No se aceptó el archivo: solo se admiten imágenes JPG, PNG o WebP." });
  });

  it("rechaza un GIF y un RIFF que no es WebP", () => {
    expect(validateImage(Uint8Array.from(Buffer.from("GIF89a....."))).ok).toBe(false);
    expect(validateImage(Uint8Array.from([...Buffer.from("RIFF"), 0, 0, 0, 0, ...Buffer.from("WAVE")])).ok).toBe(false);
  });

  it("rechaza lo que pesa más de 2 MB", () => {
    const grande = new Uint8Array(MAX_IMAGE_BYTES + 1);
    grande.set(JPG);
    expect(validateImage(grande)).toEqual({
      ok: false,
      error: "No se aceptó la imagen: pesa más de 2 MB, el máximo permitido.",
    });
  });

  it("acepta exactamente 2 MB", () => {
    const justo = new Uint8Array(MAX_IMAGE_BYTES);
    justo.set(JPG);
    expect(validateImage(justo).ok).toBe(true);
  });
});
