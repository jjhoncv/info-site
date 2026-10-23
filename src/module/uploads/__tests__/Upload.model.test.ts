import { beforeEach, describe, expect, it, vi } from "vitest";

const storage = vi.hoisted(() => ({ saveBlob: vi.fn(), readBlob: vi.fn() }));
vi.mock("../core/storage", () => storage);

import uploadModel from "../core/Upload.model";

const JPG = Uint8Array.from([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0]);
beforeEach(() => vi.clearAllMocks());

describe("uploadModel.saveImage", () => {
  it("guarda la imagen válida y devuelve su URL /media", async () => {
    const r = await uploadModel.saveImage(JPG);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.url).toMatch(/^\/media\/[0-9a-f-]{36}\.jpg$/);
    expect(storage.saveBlob).toHaveBeenCalledWith(r.url.replace("/media/", ""), JPG, "image/jpeg");
  });

  it("no guarda nada si el archivo no es válido", async () => {
    const r = await uploadModel.saveImage(Uint8Array.from(Buffer.from("hola")));
    expect(r.ok).toBe(false);
    expect(storage.saveBlob).not.toHaveBeenCalled();
  });
});

describe("uploadModel.readImage", () => {
  it("rechaza claves que no son las que generamos", async () => {
    expect(await uploadModel.readImage("../secreto")).toBeNull();
    expect(storage.readBlob).not.toHaveBeenCalled();
  });

  it("lee una clave válida", async () => {
    const clave = "0b8f3a52-6c1e-4a57-9d0e-3f2a1b4c5d6e.png";
    storage.readBlob.mockResolvedValue({ data: JPG, type: "image/png" });
    expect(await uploadModel.readImage(clave)).toEqual({ data: JPG, type: "image/png" });
  });
});
