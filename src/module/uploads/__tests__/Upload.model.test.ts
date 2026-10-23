import { beforeEach, describe, expect, it, vi } from "vitest";

const storage = vi.hoisted(() => ({ saveBlob: vi.fn(), readBlob: vi.fn(), deleteAllBlobs: vi.fn() }));
vi.mock("../core/storage", () => storage);
const repo = vi.hoisted(() => ({ reserve: vi.fn(), release: vi.fn(), count: vi.fn(), reset: vi.fn() }));
vi.mock("../core/Upload.repository", () => ({ default: repo }));

import uploadModel from "../core/Upload.model";

const JPG = Uint8Array.from([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0]);
beforeEach(() => {
  vi.clearAllMocks();
  repo.reserve.mockResolvedValue(true);
});

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

describe("tope de imágenes", () => {
  it("rechaza con el mensaje de la demo y no guarda si ya se llegó a 30", async () => {
    repo.reserve.mockResolvedValue(false);
    const r = await uploadModel.saveImage(JPG);
    expect(repo.reserve).toHaveBeenCalledWith(30);
    expect(r).toEqual({ ok: false, error: "La demo llegó al límite de imágenes; restáurala para seguir probando" });
    expect(storage.saveBlob).not.toHaveBeenCalled();
  });

  it("un archivo inválido no gasta cupo", async () => {
    await uploadModel.saveImage(Uint8Array.from(Buffer.from("hola")));
    expect(repo.reserve).not.toHaveBeenCalled();
  });

  it("devuelve el cupo si el guardado falla", async () => {
    storage.saveBlob.mockRejectedValue(new Error("sin disco"));
    await expect(uploadModel.saveImage(JPG)).rejects.toThrow("sin disco");
    expect(repo.release).toHaveBeenCalledOnce();
  });
});

describe("uploadModel.deleteAll", () => {
  it("borra todas las imágenes y pone el contador en cero", async () => {
    await uploadModel.deleteAll();
    expect(storage.deleteAllBlobs).toHaveBeenCalledOnce();
    expect(repo.reset).toHaveBeenCalledOnce();
  });

  it("si no se pueden borrar las imágenes, no toca el contador", async () => {
    storage.deleteAllBlobs.mockRejectedValue(new Error("sin red"));
    await expect(uploadModel.deleteAll()).rejects.toThrow("sin red");
    expect(repo.reset).not.toHaveBeenCalled();
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
