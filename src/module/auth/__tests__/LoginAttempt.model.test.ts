import { beforeEach, describe, expect, it, vi } from "vitest";

const repo = vi.hoisted(() => ({
  countFailures: vi.fn(),
  addFailure: vi.fn(),
  clearFailures: vi.fn(),
  deleteOlderThan: vi.fn(),
}));
vi.mock("../core/LoginAttempt.repository", () => ({ default: repo }));

import { LoginAttemptModel, MAX_ATTEMPTS, WINDOW_MINUTES } from "../core/LoginAttempt.model";

const AHORA = new Date("2026-10-22T12:00:00Z");
const hace = (minutos: number) => new Date(AHORA.getTime() - minutos * 60_000);

describe("LoginAttemptModel", () => {
  beforeEach(() => vi.resetAllMocks());

  it("el límite es 5 intentos en 15 minutos", () => {
    expect(MAX_ATTEMPTS).toBe(5);
    expect(WINDOW_MINUTES).toBe(15);
  });

  it("con 4 fallos no está bloqueado", async () => {
    repo.countFailures.mockResolvedValue(4);
    expect(await new LoginAttemptModel().isBlocked("demo", AHORA)).toBe(false);
  });

  it("con 5 fallos está bloqueado", async () => {
    repo.countFailures.mockResolvedValue(5);
    expect(await new LoginAttemptModel().isBlocked("demo", AHORA)).toBe(true);
  });

  it("solo cuenta los fallos de los últimos 15 minutos", async () => {
    repo.countFailures.mockResolvedValue(0);
    await new LoginAttemptModel().isBlocked("demo", AHORA);
    expect(repo.countFailures).toHaveBeenCalledWith("demo", hace(15));
  });

  it("el usuario se normaliza (mayúsculas y espacios) para no esquivar el límite", async () => {
    repo.countFailures.mockResolvedValue(0);
    await new LoginAttemptModel().isBlocked("  DEMO ", AHORA);
    expect(repo.countFailures).toHaveBeenCalledWith("demo", hace(15));
  });

  it("registrar un fallo guarda la hora y borra los fallos viejos", async () => {
    await new LoginAttemptModel().recordFailure("demo", AHORA);
    expect(repo.addFailure).toHaveBeenCalledWith("demo", AHORA);
    expect(repo.deleteOlderThan).toHaveBeenCalledWith(hace(15));
  });

  it("un ingreso correcto borra los fallos del usuario", async () => {
    await new LoginAttemptModel().clear("demo");
    expect(repo.clearFailures).toHaveBeenCalledWith("demo");
  });
});
