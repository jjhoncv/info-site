import { sealData } from "iron-session";
import { beforeEach, describe, expect, it } from "vitest";
import { COOKIE_NAME } from "../core/session";
import { withAdmin } from "../core/withAdmin";

const SECRET = "x".repeat(32);
const handler = withAdmin(async () => Response.json({ ok: true }));

const pedir = (cookie?: string) =>
  handler(
    new Request("http://localhost/api/admin/services", {
      headers: cookie ? { cookie: `${COOKIE_NAME}=${cookie}` } : {},
    }),
  );

describe("withAdmin", () => {
  beforeEach(() => {
    process.env.SESSION_SECRET = SECRET;
  });

  it("responde 401 sin sesión", async () => {
    const res = await pedir();
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ success: false, error: "No autenticado" });
  });

  it("responde 401 con una cookie inválida", async () => {
    expect((await pedir("basura")).status).toBe(401);
  });

  it("responde 403 con sesión válida que no es de admin", async () => {
    expect((await pedir(await sealData({ isAdmin: false }, { password: SECRET }))).status).toBe(403);
  });

  it("ejecuta el handler con sesión de admin", async () => {
    const res = await pedir(await sealData({ isAdmin: true }, { password: SECRET }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });
});
