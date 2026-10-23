import { beforeEach, expect, it, vi } from "vitest";

const m = vi.hoisted(() => ({
  restoreSeed: vi.fn(),
  deleteAll: vi.fn(),
  cookie: vi.fn(),
  revalidatePath: vi.fn(),
}));
vi.mock("@/src/module/services/core", () => ({ serviceModel: { restoreSeed: m.restoreSeed } }));
vi.mock("@/src/module/uploads/core", () => ({ uploadModel: { deleteAll: m.deleteAll } }));
vi.mock("next/headers", () => ({ cookies: async () => ({ get: m.cookie }) }));
vi.mock("next/cache", () => ({ revalidatePath: m.revalidatePath }));

import { restoreDemo } from "../core/restoreDemo";
import { restoreDemoAction } from "../core/restore.action";
import { sealData } from "iron-session";
import { COOKIE_NAME } from "@/src/module/auth/core/session";

beforeEach(() => {
  vi.resetAllMocks();
  process.env.SESSION_SECRET = "x".repeat(32);
});

it("restoreDemo borra lo subido y vuelve a cargar la semilla", async () => {
  await restoreDemo();
  expect(m.deleteAll).toHaveBeenCalledOnce();
  expect(m.restoreSeed).toHaveBeenCalledOnce();
});

it("la acción no hace nada sin sesión de admin", async () => {
  m.cookie.mockReturnValue(undefined);
  expect(await restoreDemoAction()).toEqual({ ok: false, error: "Tu sesión venció. Inicia sesión de nuevo." });
  expect(m.deleteAll).not.toHaveBeenCalled();
  expect(m.restoreSeed).not.toHaveBeenCalled();
});

it("la acción con sesión restaura y refresca las páginas", async () => {
  const valor = await sealData({ isAdmin: true }, { password: "x".repeat(32) });
  m.cookie.mockImplementation((nombre: string) => (nombre === COOKIE_NAME ? { value: valor } : undefined));
  expect(await restoreDemoAction()).toEqual({ ok: true });
  expect(m.restoreSeed).toHaveBeenCalledOnce();
  expect(m.revalidatePath).toHaveBeenCalledWith("/", "layout");
});

it("la acción avisa sin detalles internos si algo falla", async () => {
  const valor = await sealData({ isAdmin: true }, { password: "x".repeat(32) });
  m.cookie.mockReturnValue({ value: valor });
  m.deleteAll.mockRejectedValue(new Error("secreto interno"));
  vi.spyOn(console, "error").mockImplementation(() => undefined);
  expect(await restoreDemoAction()).toEqual({ ok: false, error: "No se pudo restaurar la demo. Intenta de nuevo." });
});
