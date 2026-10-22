import { beforeEach, describe, expect, it, vi } from "vitest";

const m = vi.hoisted(() => ({
  isBlocked: vi.fn(),
  recordFailure: vi.fn(),
  clear: vi.fn(),
  verifyCredentials: vi.fn(),
  save: vi.fn(),
}));
vi.mock("../core/LoginAttempt.model", () => ({
  default: { isBlocked: m.isBlocked, recordFailure: m.recordFailure, clear: m.clear },
}));
vi.mock("../core/credentials", () => ({ verifyCredentials: m.verifyCredentials }));
vi.mock("iron-session", () => ({ getIronSession: async () => ({ save: m.save }) }));
vi.mock("next/headers", () => ({ cookies: async () => ({}) }));
vi.mock("next/navigation", () => ({
  redirect: (destino: string) => {
    throw new Error(`REDIRECT:${destino}`);
  },
}));

import { login } from "../core/login.action";

const form = (clave: string) => {
  const f = new FormData();
  f.set("username", "demo");
  f.set("password", clave);
  return f;
};

describe("login con límite de intentos", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    m.isBlocked.mockResolvedValue(false);
  });

  it("bloqueado: avisa y no verifica la clave aunque sea correcta", async () => {
    m.isBlocked.mockResolvedValue(true);
    m.verifyCredentials.mockResolvedValue(true);
    expect(await login({}, form("correcta"))).toEqual({ error: "Demasiados intentos; espera 15 minutos" });
    expect(m.verifyCredentials).not.toHaveBeenCalled();
    expect(m.save).not.toHaveBeenCalled();
  });

  it("clave incorrecta: registra el fallo", async () => {
    m.verifyCredentials.mockResolvedValue(false);
    expect(await login({}, form("mala"))).toEqual({ error: "Usuario o clave incorrectos" });
    expect(m.recordFailure).toHaveBeenCalledWith("demo");
  });

  it("el fallo que completa los 5 ya avisa del bloqueo", async () => {
    m.isBlocked.mockResolvedValueOnce(false).mockResolvedValueOnce(true);
    m.verifyCredentials.mockResolvedValue(false);
    expect(await login({}, form("mala"))).toEqual({ error: "Demasiados intentos; espera 15 minutos" });
  });

  it("la base falla: muestra el aviso, registra el error y no abre sesión", async () => {
    const error = new Error("Table 'login_attempts' doesn't exist");
    m.isBlocked.mockRejectedValue(error);
    m.verifyCredentials.mockResolvedValue(true);
    const consola = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(await login({}, form("correcta"))).toEqual({
      error: "No pudimos verificar tu acceso; intenta en unos minutos",
    });
    expect(consola).toHaveBeenCalledWith(expect.any(String), error);
    expect(m.save).not.toHaveBeenCalled();
    consola.mockRestore();
  });

  it("clave correcta: limpia los fallos y entra", async () => {
    m.verifyCredentials.mockResolvedValue(true);
    await expect(login({}, form("correcta"))).rejects.toThrow("REDIRECT:/admin");
    expect(m.clear).toHaveBeenCalledWith("demo");
    expect(m.save).toHaveBeenCalled();
  });
});
