import { sealData } from "iron-session";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { COOKIE_NAME } from "@/src/module/auth/core/session";

const model = vi.hoisted(() => ({
  getServices: vi.fn(),
  getServiceBySlug: vi.fn(),
  createService: vi.fn(),
  updateService: vi.fn(),
  deleteService: vi.fn(),
}));
vi.mock("../core", async (original) => ({ ...(await original<typeof import("../core")>()), serviceModel: model }));

import { GET, POST } from "@/app/api/admin/services/route";
import { DELETE, PATCH } from "@/app/api/admin/services/[id]/route";

const SECRET = "x".repeat(32);

const pedir = async (metodo: string, sesion?: object, cuerpo?: object) => {
  const cookie = sesion ? `${COOKIE_NAME}=${await sealData(sesion, { password: SECRET })}` : "";
  return new Request("http://localhost/api/admin/services", {
    method: metodo,
    headers: cookie ? { cookie } : {},
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
  });
};
const servicioValido = {
  title: "Asesoría para empresas",
  slug: "asesoria-para-empresas",
  summary: "Resumen",
  description: "Descripción",
  includes: ["Diagnóstico"],
};
const contexto = (id: string) => ({ params: Promise.resolve({ id }) });

beforeEach(() => {
  process.env.SESSION_SECRET = SECRET;
  vi.clearAllMocks();
});

describe("GET /api/admin/services", () => {
  it("200: lista los servicios con sesión de admin", async () => {
    model.getServices.mockResolvedValue([{ id: 1, title: "A" }]);
    const res = await GET(await pedir("GET", { isAdmin: true }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true, data: [{ id: 1, title: "A" }] });
  });

  it("401: sin sesión", async () => {
    expect((await GET(await pedir("GET"))).status).toBe(401);
    expect(model.getServices).not.toHaveBeenCalled();
  });

  it("403: con sesión que no es de admin", async () => {
    expect((await GET(await pedir("GET", { isAdmin: false }))).status).toBe(403);
  });

  it("500 genérico si falla la base, sin detalles internos", async () => {
    model.getServices.mockRejectedValue(new Error("sqlMessage: tabla secreta"));
    vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await GET(await pedir("GET", { isAdmin: true }));
    expect(res.status).toBe(500);
    expect(JSON.stringify(await res.json())).not.toContain("secreta");
  });
});

describe("DELETE /api/admin/services/[id]", () => {
  it("200: borra el servicio", async () => {
    model.deleteService.mockResolvedValue(true);
    const res = await DELETE(await pedir("DELETE", { isAdmin: true }), contexto("3"));
    expect(res.status).toBe(200);
    expect(model.deleteService).toHaveBeenCalledWith(3);
  });

  it("404: el servicio no existe", async () => {
    model.deleteService.mockResolvedValue(false);
    expect((await DELETE(await pedir("DELETE", { isAdmin: true }), contexto("99"))).status).toBe(404);
  });

  it("400: id que no es un número", async () => {
    expect((await DELETE(await pedir("DELETE", { isAdmin: true }), contexto("abc"))).status).toBe(400);
    expect(model.deleteService).not.toHaveBeenCalled();
  });

  it("401: sin sesión", async () => {
    expect((await DELETE(await pedir("DELETE"), contexto("3"))).status).toBe(401);
    expect(model.deleteService).not.toHaveBeenCalled();
  });

  it("403: con sesión que no es de admin", async () => {
    expect((await DELETE(await pedir("DELETE", { isAdmin: false }), contexto("3"))).status).toBe(403);
    expect(model.deleteService).not.toHaveBeenCalled();
  });
});

describe("POST /api/admin/services", () => {
  beforeEach(() => model.getServiceBySlug.mockResolvedValue(null));

  it("201: crea el servicio con el usuario de la sesión", async () => {
    model.createService.mockResolvedValue({ id: 7, ...servicioValido });
    const res = await POST(await pedir("POST", { isAdmin: true }, servicioValido));
    expect(res.status).toBe(201);
    expect(model.createService).toHaveBeenCalledWith(servicioValido, expect.any(Number));
  });

  it("solo guarda los campos del esquema (nada de created_by ni id)", async () => {
    model.createService.mockResolvedValue({ id: 7 });
    await POST(await pedir("POST", { isAdmin: true }, { ...servicioValido, createdBy: 99, id: 1 }));
    expect(model.createService.mock.calls[0][0]).toEqual(servicioValido);
  });

  it("400: con el mismo mensaje que la interfaz", async () => {
    const res = await POST(await pedir("POST", { isAdmin: true }, { ...servicioValido, title: "" }));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe("El título es obligatorio");
    expect(model.createService).not.toHaveBeenCalled();
  });

  it("400: cuerpo que no es JSON", async () => {
    const req = new Request("http://localhost/api/admin/services", {
      method: "POST",
      headers: { cookie: `${COOKIE_NAME}=${await sealData({ isAdmin: true }, { password: SECRET })}` },
      body: "no es json",
    });
    expect((await POST(req)).status).toBe(400);
  });

  it("409: la dirección ya la usa otro servicio", async () => {
    model.getServiceBySlug.mockResolvedValue({ id: 2 });
    const res = await POST(await pedir("POST", { isAdmin: true }, servicioValido));
    expect(res.status).toBe(409);
    expect(model.createService).not.toHaveBeenCalled();
  });

  it("401 sin sesión y 403 si no es admin", async () => {
    expect((await POST(await pedir("POST", undefined, servicioValido))).status).toBe(401);
    expect((await POST(await pedir("POST", { isAdmin: false }, servicioValido))).status).toBe(403);
    expect(model.createService).not.toHaveBeenCalled();
  });
});

describe("PATCH /api/admin/services/[id]", () => {
  beforeEach(() => model.getServiceBySlug.mockResolvedValue(null));

  it("200: cambia solo lo que llega", async () => {
    model.updateService.mockResolvedValue({ id: 3, title: "Nuevo" });
    const res = await PATCH(await pedir("PATCH", { isAdmin: true }, { title: "Nuevo", createdBy: 9 }), contexto("3"));
    expect(res.status).toBe(200);
    expect(model.updateService).toHaveBeenCalledWith(3, { title: "Nuevo" }, expect.any(Number));
  });

  it("400: validación con el mensaje de la interfaz", async () => {
    const res = await PATCH(await pedir("PATCH", { isAdmin: true }, { title: "" }), contexto("3"));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe("El título es obligatorio");
  });

  it("400: id que no es un número", async () => {
    expect((await PATCH(await pedir("PATCH", { isAdmin: true }, { title: "A" }), contexto("abc"))).status).toBe(400);
  });

  it("404: el servicio no existe", async () => {
    model.updateService.mockResolvedValue(null);
    expect((await PATCH(await pedir("PATCH", { isAdmin: true }, { title: "A" }), contexto("99"))).status).toBe(404);
  });

  it("409: la dirección es de otro servicio, pero no si es la del mismo", async () => {
    model.getServiceBySlug.mockResolvedValue({ id: 2 });
    expect((await PATCH(await pedir("PATCH", { isAdmin: true }, { slug: "otro" }), contexto("3"))).status).toBe(409);
    model.getServiceBySlug.mockResolvedValue({ id: 3 });
    model.updateService.mockResolvedValue({ id: 3 });
    expect((await PATCH(await pedir("PATCH", { isAdmin: true }, { slug: "mismo" }), contexto("3"))).status).toBe(200);
  });

  it("401 sin sesión y 403 si no es admin", async () => {
    expect((await PATCH(await pedir("PATCH", undefined, { title: "A" }), contexto("3"))).status).toBe(401);
    expect((await PATCH(await pedir("PATCH", { isAdmin: false }, { title: "A" }), contexto("3"))).status).toBe(403);
    expect(model.updateService).not.toHaveBeenCalled();
  });
});
