import { sealData } from "iron-session";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { COOKIE_NAME } from "@/src/module/auth/core/session";

const model = vi.hoisted(() => ({ saveImage: vi.fn(), getImage: vi.fn() }));
vi.mock("../core/Upload.model", async (original) => ({
  ...(await original<typeof import("../core/Upload.model")>()),
  uploadModel: model,
}));

import { POST } from "@/app/api/admin/uploads/route";
import { GET } from "@/app/media/[key]/route";
import { IMAGE_ERRORS, MAX_IMAGE_BYTES } from "../core";

const SECRET = "x".repeat(32);
const PNG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

const subir = async (archivo?: File, sesion: object | null = { isAdmin: true }) => {
  const cookie = sesion ? `${COOKIE_NAME}=${await sealData(sesion, { password: SECRET })}` : "";
  const body = new FormData();
  if (archivo) body.set("file", archivo);
  return POST(new Request("http://localhost/api/admin/uploads", { method: "POST", headers: cookie ? { cookie } : {}, body }));
};
const archivo = (contenido: BlobPart, nombre: string, type: string) => new File([contenido], nombre, { type });

beforeEach(() => {
  process.env.SESSION_SECRET = SECRET;
  vi.clearAllMocks();
});

describe("POST /api/admin/uploads", () => {
  it("sin sesión responde 401 y no guarda nada", async () => {
    expect((await subir(archivo(new Uint8Array(PNG), "a.png", "image/png"), null)).status).toBe(401);
    expect(model.saveImage).not.toHaveBeenCalled();
  });

  it("guarda una imagen válida y devuelve su ruta", async () => {
    model.saveImage.mockResolvedValue("/media/abc.png");
    const res = await subir(archivo(new Uint8Array(PNG), "a.png", "image/png"));
    expect(res.status).toBe(201);
    expect((await res.json()).data).toEqual({ url: "/media/abc.png" });
    expect(model.saveImage).toHaveBeenCalledWith(expect.any(Uint8Array), "image/png");
  });

  it("rechaza un archivo que no es imagen aunque se llame .png y diga image/png", async () => {
    const res = await subir(archivo("#!/bin/sh\necho hola", "a.png", "image/png"));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe(IMAGE_ERRORS.type);
    expect(model.saveImage).not.toHaveBeenCalled();
  });

  it("rechaza lo que pesa más de 2 MB", async () => {
    const grande = new Uint8Array(MAX_IMAGE_BYTES + 1);
    grande.set(PNG);
    const res = await subir(archivo(grande, "grande.png", "image/png"));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe(IMAGE_ERRORS.size);
    expect(model.saveImage).not.toHaveBeenCalled();
  });

  it("rechaza una petición sin archivo", async () => {
    const res = await subir();
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe(IMAGE_ERRORS.empty);
  });
});

describe("GET /media/<clave>", () => {
  const ctx = (key: string) => ({ params: Promise.resolve({ key }) });
  const KEY = "123e4567-e89b-12d3-a456-426614174000.png";

  it("sirve la imagen con su tipo", async () => {
    model.getImage.mockResolvedValue({ data: new Uint8Array(PNG).buffer, type: "image/png" });
    const res = await GET(new Request(`http://localhost/media/${KEY}`), ctx(KEY));
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("image/png");
  });

  it("una clave con formato raro responde 404 sin consultar el almacén", async () => {
    const res = await GET(new Request("http://localhost/media/x"), ctx("../secreto"));
    expect(res.status).toBe(404);
    expect(model.getImage).not.toHaveBeenCalled();
  });

  it("una clave que no existe responde 404", async () => {
    model.getImage.mockResolvedValue(null);
    expect((await GET(new Request("http://localhost/media/x"), ctx(KEY))).status).toBe(404);
  });
});
