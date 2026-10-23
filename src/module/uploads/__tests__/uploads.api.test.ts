import { sealData } from "iron-session";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { COOKIE_NAME } from "@/src/module/auth/core/session";

const model = vi.hoisted(() => ({ saveImage: vi.fn(), readImage: vi.fn() }));
vi.mock("../core", () => ({ uploadModel: model }));

import { POST } from "@/app/api/admin/uploads/route";
import { GET } from "@/app/media/[key]/route";

const SECRET = "x".repeat(32);
beforeEach(() => {
  process.env.SESSION_SECRET = SECRET;
  vi.clearAllMocks();
});

const subir = async (sesion?: object, archivo: File | string | null = new File([new Uint8Array([1])], "a.png")) => {
  const cookie = sesion ? `${COOKIE_NAME}=${await sealData(sesion, { password: SECRET })}` : "";
  const form = new FormData();
  if (archivo !== null) form.set("file", archivo);
  return POST(new Request("http://localhost/api/admin/uploads", { method: "POST", headers: cookie ? { cookie } : {}, body: form }));
};

describe("POST /api/admin/uploads", () => {
  it("401 sin sesión y no guarda nada", async () => {
    expect((await subir()).status).toBe(401);
    expect(model.saveImage).not.toHaveBeenCalled();
  });

  it("403 con sesión que no es de admin", async () => {
    expect((await subir({ isAdmin: false })).status).toBe(403);
  });

  it("201 con la URL de la imagen guardada", async () => {
    model.saveImage.mockResolvedValue({ ok: true, url: "/media/abc.png" });
    const res = await subir({ isAdmin: true });
    expect(res.status).toBe(201);
    expect(await res.json()).toEqual({ success: true, data: { url: "/media/abc.png" } });
  });

  it("400 con el motivo si el archivo no es válido", async () => {
    model.saveImage.mockResolvedValue({ ok: false, error: "No se aceptó el archivo" });
    const res = await subir({ isAdmin: true });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ success: false, error: "No se aceptó el archivo" });
  });

  it("400 si no viene ningún archivo", async () => {
    expect((await subir({ isAdmin: true }, null)).status).toBe(400);
    expect((await subir({ isAdmin: true }, "texto")).status).toBe(400);
    expect(model.saveImage).not.toHaveBeenCalled();
  });
});

describe("GET /media/[key]", () => {
  const pedir = (key: string) => GET(new Request("http://localhost/media/" + key), { params: Promise.resolve({ key }) });

  it("sirve la imagen con su tipo y sin dejar que el navegador adivine", async () => {
    model.readImage.mockResolvedValue({ data: new Uint8Array([1, 2]), type: "image/png" });
    const res = await pedir("abc.png");
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("image/png");
    expect(res.headers.get("x-content-type-options")).toBe("nosniff");
  });

  it("404 si no existe", async () => {
    model.readImage.mockResolvedValue(null);
    expect((await pedir("nada.png")).status).toBe(404);
  });
});
