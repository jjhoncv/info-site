import { sealData } from "iron-session";
import { beforeEach, describe, expect, it } from "vitest";
import { COOKIE_NAME, hasAdminSession } from "../core/session";

const SECRET = "x".repeat(32);

describe("hasAdminSession", () => {
  beforeEach(() => {
    process.env.SESSION_SECRET = SECRET;
  });

  it("es falso sin cookie", async () => {
    expect(await hasAdminSession(undefined)).toBe(false);
  });

  it("es falso con una cookie manipulada", async () => {
    expect(await hasAdminSession("basura")).toBe(false);
  });

  it("es falso si está firmada con otro secreto", async () => {
    const cookie = await sealData({ isAdmin: true }, { password: "y".repeat(32) });
    expect(await hasAdminSession(cookie)).toBe(false);
  });

  it("es falso si la sesión no es de admin", async () => {
    expect(await hasAdminSession(await sealData({}, { password: SECRET }))).toBe(false);
  });

  it("es verdadero con una sesión de admin válida", async () => {
    expect(await hasAdminSession(await sealData({ isAdmin: true }, { password: SECRET }))).toBe(true);
  });

  it("es falso, sin lanzar error, si falta SESSION_SECRET", async () => {
    delete process.env.SESSION_SECRET;
    expect(await hasAdminSession("lo-que-sea")).toBe(false);
  });

  it("usa un nombre de cookie fijo", () => {
    expect(COOKIE_NAME).toBe("info-site-sesion");
  });
});
