import { sealData } from "iron-session";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { COOKIE_NAME } from "@/src/module/auth/core/session";

const model = vi.hoisted(() => ({ getServices: vi.fn(), deleteService: vi.fn() }));
vi.mock("../core", () => ({ serviceModel: model }));

import { GET } from "@/app/api/admin/services/route";
import { DELETE } from "@/app/api/admin/services/[id]/route";

const SECRET = "x".repeat(32);

const pedir = async (metodo: string, sesion?: object) => {
  const cookie = sesion ? `${COOKIE_NAME}=${await sealData(sesion, { password: SECRET })}` : "";
  return new Request("http://localhost/api/admin/services", { method: metodo, headers: cookie ? { cookie } : {} });
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
