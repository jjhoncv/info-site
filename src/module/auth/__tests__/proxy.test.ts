import { sealData } from "iron-session";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it } from "vitest";
import { proxy } from "@/proxy";
import { COOKIE_NAME } from "../core/session";

const SECRET = "x".repeat(32);
const pedir = (ruta: string, cookie?: string) =>
  proxy(new NextRequest(`http://localhost${ruta}`, { headers: cookie ? { cookie: `${COOKIE_NAME}=${cookie}` } : {} }));

describe("proxy", () => {
  beforeEach(() => {
    process.env.SESSION_SECRET = SECRET;
  });

  it("manda a /login a quien entra a /admin sin sesión", async () => {
    const res = await pedir("/admin/services");
    expect(res.status).toBe(307);
    expect(new URL(res.headers.get("location")!).pathname).toBe("/login");
  });

  it("deja pasar a quien tiene sesión de admin", async () => {
    const res = await pedir("/admin/services", await sealData({ isAdmin: true }, { password: SECRET }));
    expect(res.headers.get("location")).toBeNull();
  });
});
