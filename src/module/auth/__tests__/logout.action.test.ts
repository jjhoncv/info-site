import { expect, it, vi } from "vitest";

const m = vi.hoisted(() => ({ destroy: vi.fn() }));
vi.mock("iron-session", () => ({ getIronSession: async () => ({ destroy: m.destroy }) }));
vi.mock("next/headers", () => ({ cookies: async () => ({}) }));
vi.mock("next/navigation", () => ({
  redirect: (destino: string) => {
    throw new Error(`REDIRECT:${destino}`);
  },
}));

import { logout } from "../core/logout.action";

it("destruye la sesión y manda al login", async () => {
  process.env.SESSION_SECRET = "x".repeat(32);
  await expect(logout()).rejects.toThrow("REDIRECT:/login");
  expect(m.destroy).toHaveBeenCalled();
});
