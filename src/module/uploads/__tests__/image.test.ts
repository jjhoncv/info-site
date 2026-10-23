import { describe, expect, it } from "vitest";
import { checkImage, detectImageType, IMAGE_ERRORS, MAX_IMAGE_BYTES } from "../core/image";

const JPG = [0xff, 0xd8, 0xff, 0xe0];
const PNG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const WEBP = [0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50];
const bytes = (cabecera: number[], largo = 64) => Uint8Array.from({ length: largo }, (_, i) => cabecera[i] ?? 0);

describe("detectImageType", () => {
  it("reconoce JPG, PNG y WebP por su contenido", () => {
    expect(detectImageType(bytes(JPG))).toBe("image/jpeg");
    expect(detectImageType(bytes(PNG))).toBe("image/png");
    expect(detectImageType(bytes(WEBP))).toBe("image/webp");
  });

  it("no acepta otros contenidos, aunque digan ser imágenes", () => {
    const texto = new TextEncoder().encode("<svg xmlns='http://www.w3.org/2000/svg'></svg>");
    expect(detectImageType(texto)).toBeUndefined();
    expect(detectImageType(new TextEncoder().encode("GIF89a"))).toBeUndefined();
    // RIFF que no es WebP (por ejemplo, un WAV)
    expect(detectImageType(bytes([0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x41, 0x56, 0x45]))).toBeUndefined();
  });
});

describe("checkImage", () => {
  it("acepta una imagen válida y devuelve su tipo", () => {
    expect(checkImage(bytes(PNG))).toEqual({ ok: true, type: "image/png" });
  });

  it("explica por qué rechaza un archivo que no es JPG, PNG ni WebP", () => {
    expect(checkImage(new TextEncoder().encode("hola"))).toEqual({ ok: false, error: IMAGE_ERRORS.type });
  });

  it("rechaza lo que pesa más de 2 MB y acepta justo 2 MB", () => {
    expect(checkImage(bytes(JPG, MAX_IMAGE_BYTES + 1))).toEqual({ ok: false, error: IMAGE_ERRORS.size });
    expect(checkImage(bytes(JPG, MAX_IMAGE_BYTES)).ok).toBe(true);
  });

  it("rechaza un archivo vacío", () => {
    expect(checkImage(new Uint8Array())).toEqual({ ok: false, error: IMAGE_ERRORS.empty });
  });
});
